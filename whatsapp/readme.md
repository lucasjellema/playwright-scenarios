Module whatsapp.js navigates to the WhatsApp Web application. It runs in headful mode and it will present a QR code that you need to scan in the WhatsApp App on your mobile device. The module will then send a message to a WhatsApp contact. The contact and the message are defined in the constants `whatsappContact` and `message`. 

The modules can be ran using:
`node whatsapp.js`

It would be easy to extend the module with additional functionality - for retrieving and returning messages, for sending images, for sending messages to multiple contacts, for spellchecking and expaning acronyms and abbreviations, for translating and for listening for incoming messages and publishing events when they arrive.

It would also be easy wrap the module in a true API - as is done in module *translate* that wraps the Google Translate UI in a local API.