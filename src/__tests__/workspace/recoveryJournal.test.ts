/** @jest-environment jsdom */
import { JOURNAL_KEY, newDraftId, newId, readJournal, removeRecord, saveRecord, type JournalRecord } from '@/components/workspace/recoveryJournal';
const record=(over:Partial<JournalRecord>={}):JournalRecord=>({v:1,op:'op-1',user:'user-a',mode:'live',backend:'0123456789abcdef',agent:'greeting_agent',session:'11111111-1111-4111-8111-111111111111',stage:'create',at:1,...over});
beforeEach(()=>{localStorage.clear();jest.restoreAllMocks();});
test('stores only scoped identity, operation, stage and time — never message text or extra fields',()=>{
 saveRecord({...record(),message:'secret text',token:'t'} as unknown as JournalRecord);
 const raw=localStorage.getItem(JOURNAL_KEY)!;expect(raw).not.toMatch(/secret|token|message/);
 expect(Object.keys(JSON.parse(raw)[0]).sort()).toEqual(['agent','at','backend','mode','op','session','stage','user','v']);
});
test('replace by operation, scoped read by verified user and mode, removal',()=>{
 saveRecord(record());saveRecord(record({stage:'uncertain'}));saveRecord(record({op:'op-2',user:'user-b'}));saveRecord(record({op:'op-3',mode:'mock'}));
 expect(readJournal({user:'user-a',mode:'live'})).toEqual([record({stage:'uncertain'})]);
 expect(readJournal({user:'user-b',mode:'live'}).map(r=>r.op)).toEqual(['op-2']);
 expect(removeRecord('op-1')).toBe(true);expect(readJournal({user:'user-a',mode:'live'})).toEqual([]);expect(readJournal({user:'user-b',mode:'live'})).toHaveLength(1);
});
test('malformed, partially valid and oversize stored content never crashes and is bounded',()=>{
 localStorage.setItem(JOURNAL_KEY,'{not json');expect(readJournal({user:'user-a',mode:'live'})).toEqual([]);
 localStorage.setItem(JOURNAL_KEY,JSON.stringify([record(),{v:2},{...record({op:'x'}),stage:'done'},'junk',null]));expect(readJournal({user:'user-a',mode:'live'})).toEqual([record()]);
 localStorage.setItem(JOURNAL_KEY,'['+' '.repeat(40_000)+']');expect(readJournal({user:'user-a',mode:'live'})).toEqual([]);
 expect(()=>saveRecord(record({session:'x'.repeat(500)}))).toThrow();
});
test('unavailable or non-persisting storage throws on save so callers refuse to send; reads degrade to []',()=>{
 jest.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new DOMException('quota','QuotaExceededError');});
 expect(()=>saveRecord(record())).toThrow('Recovery storage unavailable');expect(removeRecord('op-1')).toBe(true);
 jest.restoreAllMocks();jest.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{});
 expect(()=>saveRecord(record())).toThrow('Recovery storage unavailable');
 jest.restoreAllMocks();jest.spyOn(Storage.prototype,'getItem').mockImplementation(()=>{throw new DOMException('blocked','SecurityError');});
 expect(readJournal({user:'user-a',mode:'live'})).toEqual([]);expect(()=>saveRecord(record())).toThrow();
});
test('bounded record count refuses rather than silently dropping unresolved warnings',()=>{
 for(let i=0;i<50;i++)saveRecord(record({op:'op-'+i}));
 expect(()=>saveRecord(record({op:'op-overflow'}))).toThrow();expect(readJournal({user:'user-a',mode:'live'})).toHaveLength(50);
});
test('IDs: v4 UUIDs (with a getRandomValues fallback) and short URL-safe draft IDs',()=>{
 expect(newId()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
 const original=crypto.randomUUID;Object.defineProperty(crypto,'randomUUID',{configurable:true,value:undefined});
 try{expect(newId()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);}finally{Object.defineProperty(crypto,'randomUUID',{configurable:true,value:original});}
 expect(newDraftId()).toMatch(/^d[0-9a-f]{8}$/);expect(newDraftId()).not.toBe(newDraftId());
});
