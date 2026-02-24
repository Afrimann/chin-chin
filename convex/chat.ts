import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import OpenAI from "openai";

export const sendMessage = action({
  args: {
    message: v.string(),
    history: v.array(v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.optional(v.string())
    }))
  },
  handler: async (ctx, args): Promise<{ 
    content: string, 
    action?: { type: "navigate", url: string } | { type: "add_to_cart", productId: string, quantity: number } 
  }> => {
    // 1. Fetch products from the database to give context to the AI
    const products = await ctx.runQuery(api.products.get as any, {});
    
    const productContext = (products as any[]).map((p: any) => 
        `- ${p.name} (Price: ₦${p.price}) [ID: ${p._id}]: ${p.description}`
    ).join("\n");

    const systemPrompt: string = `You are the Chin-Chin Guide, a helpful and friendly AI assistant for "Chin-Chin", an e-commerce store selling premium Nigerian snacks.
    
    Information about our products (IMPORTANT: Use the exact [ID] for tools):
    ${productContext}
    
    Guidelines:
    1. Be polite, energetic, and helpful.
    2. If someone asks for recommendations, use the product list provided.
    3. NEVER display the technical [ID] in your conversation with the user. It is for your internal tool use only.
    4. If you don't know the answer, ask them to contact support at support@chinchin.com.
    5. Keep responses concise and engaging.
    6. Use emojis where appropriate.
    
    Navigation:
    You can help users navigate the site using the 'navigate' tool.
    Available routes:
    - /: Home page
    - /#about: About Us section
    - /#contact: Contact section
    - /#products: Featured products section
    - /dashboard: Main shop/home
    - /dashboard/cart: Shopping cart
    - /dashboard/orders: Order history
    - /dashboard/support: Support page
    - /dashboard/products: Product catalog
    
    Add to Cart:
    You can add products to the user's cart using the 'add_to_cart' tool. 
    ALWAYS ask for confirmation before adding items unless the user explicitly says "add [product] to my cart".
    After adding an item, tell them it's in their cart and ask if they'd like to check out or keep browsing.

    Parting Instruction (Navigation):
    When using the 'navigate' tool, make your text response a finalizing confirmation (e.g., "Certainly! I'm taking you to your orders now. See you there!"). Do not ask follow-up questions in the same message as a navigation tool call, as the chat window will close during the transition.
    
    Out-of-Scope Queries:
    If a user asks for something outside your snack-related expertise, politely steer them back by listing your capabilities:
    - Recommending premium flavors 🍪
    - Detailed ingredient information
    - Adding items to cart 🛒
    - Navigating to Orders/Cart/Support 🚀`;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return { content: "AI is not configured yet." };
    }

    try {
      const client = new OpenAI({
        apiKey,
        baseURL: "https://api.groq.com/openai/v1",
      });

      const messages: any[] = [
        { role: "system", content: systemPrompt },
        ...args.history.map(h => ({ role: h.role, content: h.content || "" })),
        { role: "user", content: args.message }
      ];

      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages,
        tools: [
          {
            type: "function",
            function: {
              name: "navigate",
              description: "Navigate the user to a specific page on the website.",
              parameters: {
                type: "object",
                properties: {
                  url: {
                    type: "string",
                    description: "The relative URL to navigate to."
                  }
                },
                required: ["url"]
              }
            }
          },
          {
            type: "function",
            function: {
              name: "add_to_cart",
              description: "Add a product to the user's shopping cart.",
              parameters: {
                type: "object",
                properties: {
                  productId: {
                    type: "string",
                    description: "The ID of the product to add."
                  },
                  productName: {
                    type: "string",
                    description: "The name of the product (for confirmation message)."
                  },
                  quantity: {
                    type: "number",
                    description: "The quantity to add (default is 1)."
                  }
                },
                required: ["productId", "productName"]
              }
            }
          }
        ],
        tool_choice: "auto",
        temperature: 0.7,
      });

      const message = completion.choices[0].message;
      let replyContent = message.content || "";
      let actionResult = undefined;

      if (message.tool_calls && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0] as any;
        const toolArgs = JSON.parse(toolCall.function.arguments);

        if (toolCall.function?.name === "navigate") {
            actionResult = { type: "navigate" as const, url: toolArgs.url };
            if (!replyContent) replyContent = `Sure! Taking you to ${toolArgs.url}...`;
        } else if (toolCall.function?.name === "add_to_cart") {
            actionResult = { 
                type: "add_to_cart" as const, 
                productId: toolArgs.productId,
                quantity: toolArgs.quantity || 1
            };
            if (!replyContent) replyContent = `I've added ${toolArgs.quantity || 1}x ${toolArgs.productName} to your cart! 🛒`;
        }
      }

      return {
        content: replyContent || "I'm here to help with all your Chin-Chin needs! Feel free to ask about our flavors or managing your cart. 🍪",
        action: actionResult as any
      };

    } catch (error) {
      console.error("GROQ ERROR:", error);
      return { 
        content: "I'm having a brief moment of silence while I refresh. In the meantime, remember I can help you find flavors, add items to your cart, or navigate the shop! 🍪\n\nPlease try your request again." 
      };
    }
  }
});

