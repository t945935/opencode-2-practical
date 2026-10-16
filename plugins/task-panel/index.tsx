import { Plugin } from '@opencode/plugin/tui'
export default Plugin.define({
 id: 'issuedesk.task-panel',
 setup(ctx) {
  const dispose = ctx.ui.slot({
   append: 'sidebar.footer',
   render: ({ sessionID }) => (
    <box flexDirection="column" paddingTop={1}>
     <text fg="#42D6C4">IssueDesk 任務資訊</text>
     <text>{sessionID}</text>
     <text>{ctx.data.session.get(sessionID)?.title ?? '未命名工作階段'}</text>
    </box>
   ),
  })
  return () => dispose()
 },
})
