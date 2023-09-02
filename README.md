
### Introduction

This project demonstrates a single page mail application built using Django and Javascript.

The working and functionalities are similar to traditional mail applications.

  
  

### Functionalities

- Send Mail:  Allows user to submit/send an email

  

- Mailbox:  When a user visits their Inbox, Sent mailbox, or Archive, the appropriate mailbox is loaded.

  

- View Email:  When a user clicks on an email, the user is taken to a view where they see the content of that email.

  

- Archive and Unarchive:  Allow users to archive and unarchive emails that they have received.

  

- Reply: Allow users to reply to an email.

  

### API

This application supports the following API routes:

  

```
GET /emails/<str:mailbox>
```

Sending a GET request to /emails/<mailbox> where <mailbox> is either inbox, sent, or archive will return back to you (in JSON form) a list of all emails in that mailbox, in reverse chronological order.

  
```
GET /emails/<int:email_id>
```
  

Sending a GET request to /emails/email_id where email_id is an integer id for an email will return a JSON representation of the email.

  
```
POST /emails
```
  

To send an email, you can send a POST request to the /emails route. The route requires three pieces of data to be submitted: a recipients value (a comma-separated string of all users to send an email to), a subject string, and a body string. 

  
```
PUT /emails/<int:email_id>
```
  

To mark an email as read/unread or as archived/unarchived. To do so, send a PUT request (instead of a GET) request to /emails/<email_id> where email_id is the id of the email you’re trying to modify.

### Video Demo
Watch a video demo [here](https://www.youtube.com/watch?v=xkiFGsjsOfU&t=5s)
