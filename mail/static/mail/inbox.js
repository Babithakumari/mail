//When  back arrow is clicked maintain previous state
window.onpopstate = function(event){
    console.log(event.state.id);
    load_mailbox(event.state.id);
}







document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', compose_email);

    // By default, load the inbox
    load_mailbox('inbox');
        

    

    // Add current state to history
    document.querySelectorAll('button').forEach(button => {
        button.onclick = function(){
            let action = button.id
            history.pushState({action}, "", `/emails/${action}`);

    
        }

    })
    
    
});


function compose_email() {

    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#details-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';


    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
    
    // Submit mail
    submit_mail()

        
}

function submit_mail(){

        document.querySelector('#compose-form').onsubmit = () => {

             
            const recipients = document.querySelector('#compose-recipients').value;
            const subject = document.querySelector('#compose-subject').value;
            const body = document.querySelector('#compose-body').value;
            
            // On form submission fetch data
            fetch('/emails', {
                    method: 'POST',
                    body: JSON.stringify({
                        recipients: recipients,
                        subject: subject,
                        body: body
                    })
                })
                .then(response => response.json())
                .then(result => {


                     
                    // If email sent succsfully
                    if (result.message == "Email sent successfully.") {

                        // Load 'sent' mailbox
                        load_mailbox('sent');


                    }
    
                    // if errors
                    else {
                        alert('Error : ' + result.error);
    
                    }
    
    
                })
                
                // Prevent form from submission
                return false;
    
            }
    
}



function load_mailbox(mailbox) {

    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#details-view').style.display = 'none';

    // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

    //GET all the mails
    fetch(`/emails/${mailbox}`)
        .then(response => response.json())
        .then(emails =>

            // Display each mail
            emails.forEach(email => {
            

                // Create a div 
                let email_list = document.createElement('div');
                email_list.className = 'mail';
                document.querySelector('#emails-view').appendChild(email_list);

                
                

                // Arranging div elements
                email_list.innerHTML =
                    `<span id = "sender"><strong>${email.sender}</strong></span>
                    <span id = "subject">${email.subject} </span>
                    <span id = "timestamp">${email.timestamp}</span><br>
                    <button class="btn btn-sm btn-primary view" data-id = "${email.id}">view</button>`;

                

                // View email on click
                bts = document.querySelectorAll('.view');
                bts.forEach(btn => {
                    btn.onclick = () => {
                        mail_content(btn.dataset.id)

                        

                    }
                })

                // check 'read' status
                if (email.read) {
                    email_list.style.backgroundColor = "#E1E5EA";
                } 
                else {
                    email_list.style.backgroundColor = "#FFFFFF";


                }

                
            }))






}

function mail_content(mail_id) {
    location.hash = mail_id
    
    document.querySelector('#details-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#emails-view').style.display = 'none';


    // Update read to be true
    fetch(`/emails/${mail_id}`, {
        method: "PUT",
        body: JSON.stringify({
            read: true
        })
    })

    // Fetch email contents
    fetch(`/emails/${mail_id}`)
        .then(response => response.json())
        .then(data => {

            

            // Display email contents
            
            document.querySelector('#details-view').innerHTML =
                `<p><strong>From : </strong>${data.sender}</p>
                 <p><strong>To : </strong>${data.recipients}</p>
                 <p><strong>Timestamp : </strong>${data.timestamp}</p>
                 <p><strong>Subject : </strong> ${data.subject}</p><hr>
                 <p>${data.body}</p>
                 <button data-id = "${data.id}" data-status="${data.archived}"  class = "btn btn-primary archive">Archive</button>
                 <button data-id = "${data.id}" class = "btn btn-primary reply">Reply</button>`;



            
            //  Add Unarchive feature for 'archive' mailbox
            if (data.archived)
            {
                document.querySelector(".archive").innerHTML = 'unarchive';
                
                
            }
            
            // Remove 'archive' and 'reply' if 'sent' mailbox
            current_user = document.querySelector('#current_user').innerHTML;
            if (current_user == data.sender){
                document.querySelector(".archive").style.display = 'none';
                document.querySelector(".reply").style.display = 'none';
            }



            // Archive button event listener
            archive_btn = document.querySelectorAll('.archive');
            archive_btn.forEach(archive =>
                archive.addEventListener('click', () => {archive_mail(archive.dataset.id, archive.dataset.status)}))

            
            
            // Reply button event listener
            reply_btn = document.querySelectorAll('.reply');
            reply_btn.forEach(reply =>
                reply.addEventListener('click', () => {reply_mail(reply.dataset.id)}))

            

        })

}

function archive_mail(mail_id, isarchived) {
    
    let status = JSON.parse(isarchived);
    console.log(status);


    


    // Update archived as true / False
    fetch(`/emails/${mail_id}`, {
        method: "PUT",
        body: JSON.stringify({
            archived: !status
        })
    }).then(() =>{
            
        // Load user's inbox
    
        load_mailbox('inbox')

     })

}





function reply_mail(mail_id) {

    // Display
    document.querySelector('#details-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#emails-view').style.display = 'none';



    // Prefill To, Subject, Body
    fetch(`/emails/${mail_id}`)
        .then(response => response.json())
        .then(data => {

            // Prefill To
            document.querySelector('#compose-recipients').value = data.sender;

            // Prefill subject
            subject = document.querySelector('#compose-subject');

            if (data.subject.slice(0,2) == 'Re'){
                subject.value = data.subject;
            }
            else{
                subject.value = 'Re : '+ data.subject;
            
            }

            // Prefill body
            document.querySelector('#compose-body').value = '\r\n'+'On '+data.timestamp + ' ' +data.sender +' wrote : '+ data.body +'\r\n' ;


        })

    // Submit the composed mail   
    submit_mail()

}

// Event handler
function locationHashChanged() {  
    (location.hash === "#/emails/id/") &&  mail_contentHandler();
    
    }  
   
  
  window.onhashchange = locationHashChanged;
  

