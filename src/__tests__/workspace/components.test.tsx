/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { WorkspaceComposer } from '@/components/workspace/WorkspaceComposer';
import { CopyControl } from '@/components/workspace/CopyControl';
import { DEMO_DISCLOSURE, initialDemo } from '@/components/workspace/DemoContext';

test('composer has label, rejects whitespace, honors IME and Shift+Enter',()=>{
 const send=jest.fn(),change=jest.fn();const {rerender}=render(<WorkspaceComposer name="A" value="  " onChange={change} onSend={send} disabled={false}/>);
 expect(screen.getByRole('button',{name:'Send message'})).toBeDisabled();fireEvent.keyDown(screen.getByLabelText('Message'),{key:'Enter'});expect(send).not.toHaveBeenCalled();
 rerender(<WorkspaceComposer name="A" value="Hello" onChange={change} onSend={send} disabled={false}/>);
 fireEvent.keyDown(screen.getByLabelText('Message'),{key:'Enter',isComposing:true});fireEvent.keyDown(screen.getByLabelText('Message'),{key:'Enter',shiftKey:true});expect(send).not.toHaveBeenCalled();fireEvent.keyDown(screen.getByLabelText('Message'),{key:'Enter'});expect(send).toHaveBeenCalledTimes(1);
 rerender(<WorkspaceComposer name="A" value="Hello" onChange={change} onSend={send} disabled/>);fireEvent.keyDown(screen.getByLabelText('Message'),{key:'Enter'});expect(send).toHaveBeenCalledTimes(1);
});
test('blocked clipboard exposes exact selectable Markdown without HTML injection',async()=>{
 Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:jest.fn().mockRejectedValue(Error('denied'))}});
 render(<CopyControl text={'**literal** <script>not executable</script>'}/>);fireEvent.click(screen.getByRole('button',{name:'Copy message'}));expect(await screen.findByLabelText('Text to copy manually')).toHaveValue('**literal** <script>not executable</script>');expect(document.querySelector('script')).toBeNull();
});
test('demo defaults return independent mutable copies and permanent disclosure is explicit',()=>{
 const a=initialDemo(),b=initialDemo();a.samples.pop();expect(b.samples).toHaveLength(2);expect(DEMO_DISCLOSURE).toContain('not sent to the agent');expect(DEMO_DISCLOSURE).toContain('reset on reload');
});

let mockPathname='/mission-control';
jest.mock('next/navigation',()=>({usePathname:()=>mockPathname}));
import AppShellPage from '@/components/common/AppShellPage';
test('workbench route releases inherited shell scroll lock; other routes retain their shell',()=>{
 mockPathname='/mission-control';const props={sidebar:<div>Existing sidebar</div>,workbenchRoute:true,children:<div>Route content</div>};const {rerender,unmount}=render(<AppShellPage {...props}/>);fireEvent.click(screen.getByRole('button',{name:'Open navigation menu'}));expect(document.body.style.overflow).toBe('hidden');
 mockPathname='/chat';rerender(<AppShellPage {...props}/>);expect(document.body.style.overflow).not.toBe('hidden');expect(screen.queryByText('Existing sidebar')).toBeNull();expect(screen.getByText('Route content')).toBeInTheDocument();unmount();
});
