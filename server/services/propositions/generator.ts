import { extractPropositionsWithLLM } from '../../gemini';
import { countTokens } from '../ingestion/parser';
import crypto from 'crypto';

export interface GeneratedProposition {
  id: string;
  text: string;
  importance: number;
  tokenCount: number;
  contentHash: string;
}

export async function generatePropositionsForChunk(
  chunkId: string,
  chunkText: string
): Promise<GeneratedProposition[]> {
  const extracted = await extractPropositionsWithLLM(chunkText);

  return extracted.map((item, idx) => {
    const id = `${chunkId}-P${idx + 1}`;
    const hash = crypto.createHash('sha256').update(item.text).digest('hex').slice(0, 16);
    return {
      id,
      text: item.text,
      importance: item.importance || 0.85,
      tokenCount: countTokens(item.text),
      contentHash: `sha256:${hash}`
    };
  });
}
