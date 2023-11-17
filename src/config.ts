import * as dotenv from 'dotenv'
dotenv.config()

export const CONFIG = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  END_HOUR: parseInt(`${process.env.END_HOUR}`),
  START_HOUR: parseInt(`${process.env.START_HOUR}`),
}