// expected-red seed: the QA harness must refuse to bundle a production service import.
import { chatService } from '@/services/chatService';
console.log(chatService);
