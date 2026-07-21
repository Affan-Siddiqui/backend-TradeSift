import ngrok from "@ngrok/ngrok";
import dotenv from "dotenv";

dotenv.config();

const ngrokUrl = async (): Promise<void> => {
  try {
    const listener = await ngrok.forward({
      addr: 3000,
      authtoken: process.env.AUTH_TOKEN_NGROK as string,
    });

    console.log(`Ingress established at: ${listener.url()}`);
  } catch (error) {
    console.error("Failed to start ngrok:", error);
  }
};

export default ngrokUrl;