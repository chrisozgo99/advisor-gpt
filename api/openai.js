import OpenAI from "openai";
import *  as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function main() {
    const thread = await openai.beta.threads.create();

    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: process.env.OPENAI_ASSISTANT_ID,   
        instructions: "Generate question-answer pairs that would be helpful to fine-tune a Large Language Model to be a Georgia Tech school of Electrical and Computer Engineering Curriculum Advisor. Questions should be generated as if they are being asked from a student, and answered as if they are being answered by the LLM that has been fine-tuned to be a Georgia Tech school of Electrical and Computer Engineering Curriculum Advisor. Place special emphasis on asking questions related to coursework and four year plans."
    });

    console.log(run);

  }
  
  main();