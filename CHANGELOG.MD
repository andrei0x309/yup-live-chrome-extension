# Change Log

## [Version 1.1.6]

- changed login and baseURL to use yup live because app.yup.live is not working with extension

## [Version 1.1.5]

- improved notification handling and display
- lowerd coinGecko api calls due to recent changes in free tier limit

## [Version 1.1.4]

- minor fix edge case of no notifications

## [Version 1.1.3]

- minor fix to prevent console error log on fetch failure

## [Version 1.1.2]

- changed service worker open notification to use app.yup.io
- fixed follow notification with multiple senders

## [Version 1.1.1]

- changed auth condition
- refactor image loader for notification images
- added constant for yup app base url
- other cleanups

## [Version 1.0.9]

- added: browser notifications(work similar to push notifications) for comment, mention, follow with the ability to open the notification in app
- changed login to use app.yup.io
- removed external navigation to yup-live
- added more settings
- fixed some service worker issues

## [Version 1.0.8]

- migrated from windicss to tailwindcss
- migrated to web3-notifications and adapted them
- changed like component
- changed injected overlay to support new like component and delete vote
  
## [Version 1.0.7]

- fixed background notification
  
## [Version 1.0.6]

- refactored notifications
- added support for aggregated notifications
- added support for follow notification

## [Version 1.0.5]

- added: `setting` to enable right click page context like at user suggestion
- added: `setting` to enable chrome notification on like success/fail from right click context
- refactor: track for reward notification
- disabled: some logs

## [Version 1.0.4]

- fix: add missing key
  
## [Version 1.0.3]

- change some user error messages
- case detection if there's no active tab
- always show rating website even if the tab is not active
- change the header to a fixed size to not overflow if the extension is installed on a mobile device: Ex: Kivi/Yandex
- added link to mobile APP version of yup live
- replaced setting for notification when refill to auto refill if you are online

## [Version 1.0.2]

- small url fix
- fixed some logic with chrome native notifications

## [Version 1.0.1]

- first release
  