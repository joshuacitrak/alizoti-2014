<?php
require_once 'PHPMailerAutoload.php';

if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['message'])) {

    //check if any of the inputs are empty
    if (empty($_POST['name']) || empty($_POST['email']) ||  empty($_POST['message'])) {
        $data = array('success' => false, 'message' => 'Please fill out the form completely.');
        echo json_encode($data);
        exit;
    }

    //create an instance of PHPMailer
    $mail = new PHPMailer();
    
    /*GMAIL STUFF*/
    //Tell PHPMailer to use SMTP
    $mail->isSMTP();
    
    //Set the hostname of the mail server
    $mail->Host = 'smtp.gmail.com';

    //Set the SMTP port number - 587 for authenticated TLS, a.k.a. RFC4409 SMTP submission
    $mail->Port = 587;

    //Set the encryption system to use - ssl (deprecated) or tls
    $mail->SMTPSecure = 'tls';

    //Whether to use SMTP authentication
    $mail->SMTPAuth = true;

    //Username to use for SMTP authentication - use full email address for gmail
    $mail->Username = "xxxxx";

    //Password to use for SMTP authentication
    $mail->Password = "xxxxx";

    //Set who the message is to be sent from
    $mail->setFrom('from@example.com', 'First Last');

    $mail->From = $_POST['email'];
    $mail->FromName = $_POST['name'];
    $mail->AddAddress('joshuacitrak@gmail.com'); //recipient 
    $mail->Subject = 'From Alizoti.com '.  $_POST['project-type'];
    $mail->Body = "Name: " . $_POST['name'] .  "\r\n\r\nProject Type: "  . $_POST['project-type'] . "\r\n\r\nPhone: " . $_POST['phone'] . "\r\n\r\nMessage: " .stripslashes($_POST['message']);

    if (isset($_POST['ref'])) {
        $mail->Body .= "\r\n\r\nRef: " . $_POST['ref'];
    }

    if(!$mail->send()) {
        $data = array('success' => false, 'message' => 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo);
        echo json_encode($data);
        exit;
    }

    $data = array('success' => true, 'message' => 'Thanks! We have received your message.');
    echo json_encode($data);

} else {

    $data = array('success' => false, 'message' => 'Please fill out the form completely.');
    echo json_encode($data);

}
?>