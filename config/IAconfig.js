import dotenv from 'dotenv';

import OpenAI from 'openai';

dotenv.config({path: './config/.env'});

const openai = new OpenAI({apikey: process.env.OPENAI_API_KEY});

export default openai;