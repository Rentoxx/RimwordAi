// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { configuration } from '@/utils/constants'
import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAIApi } from 'openai'

type Data = {
  result: string
}

const openai = new OpenAIApi(configuration)

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data> ) {

  const { numNames, origin, input } = req.body

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `You are a Person that loves traveling. You have met thousands of people in your life and experienced different cultures. Provide new and creative Names containing first name, nickname and family name for the specified amount of Rimworld Colonists below. Pay attention to the desired origin below and additional wishes. Output the names as Arrays inside an Array without quotes. Remeber, that the nickname has to be in the origin language if defined. Amount: """ ${numNames} """ Origin: """ ${origin} """ Additional Wishes: """ ${input} """ Output:`,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  const suggestion = response.data?.choices?.[0]?.text

  if(suggestion === undefined) {
    throw new Error('No names found')
  }


  res.status(200).json({ result: suggestion });
}
