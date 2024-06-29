import { RunnableSequence, RunnableMap } from '@langchain/core/runnables';
import ListLineOutputParser from '../lib/outputParsers/listLineOutputParser';
import { PromptTemplate } from '@langchain/core/prompts';
import formatChatHistoryAsString from '../utils/formatHistory';
import { BaseMessage } from '@langchain/core/messages';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOpenAI } from '@langchain/openai';

const suggestionGeneratorPrompt = `
귀하는 인공지능 기반 검색 엔진의 인공지능 추천 생성자입니다. 아래에 대화가 주어집니다. 대화를 기반으로 4~5개의 제안을 생성해야 합니다. 제안은 사용자가 채팅 모델에게 추가 정보를 요청하는 데 사용할 수 있는 대화와 관련성이 있어야 합니다.
제안이 대화와 관련이 있고 사용자에게 도움이 되는지 확인해야 합니다. 사용자가 이러한 제안을 사용하여 채팅 모델에게 추가 정보를 요청할 수 있다는 점에 유의하세요. 
제안의 길이는 짧고 간략하면서, 유익하고 대화와 관련이 있는지 확인하세요.

XML 태그 <suggestions>와 </suggestions> 사이에 개행으로 구분하여 이러한 제안을 제공하세요. 예를 들어

<suggestions>
SpaceX와 최근 프로젝트에 대해 자세히 알려주세요.
SpaceX에 대한 최신 뉴스는 무엇인가요?
SpaceX의 CEO는 누구인가요?
</suggestions>

Conversation:
{chat_history}
`;

type SuggestionGeneratorInput = {
  chat_history: BaseMessage[];
};

const outputParser = new ListLineOutputParser({
  key: 'suggestions',
});

const createSuggestionGeneratorChain = (llm: BaseChatModel) => {
  return RunnableSequence.from([
    RunnableMap.from({
      chat_history: (input: SuggestionGeneratorInput) =>
        formatChatHistoryAsString(input.chat_history),
    }),
    PromptTemplate.fromTemplate(suggestionGeneratorPrompt),
    llm,
    outputParser,
  ]);
};

const generateSuggestions = (
  input: SuggestionGeneratorInput,
  llm: BaseChatModel,
) => {
  (llm as ChatOpenAI).temperature = 0;
  const suggestionGeneratorChain = createSuggestionGeneratorChain(llm);
  return suggestionGeneratorChain.invoke(input);
};

export default generateSuggestions;
