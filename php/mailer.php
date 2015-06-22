<?php
require 'PHPMailerAutoload.php';

if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['message'])) {

    //check if any of the inputs are empty
    if (empty($_POST['name']) || empty($_POST['email']) ||  empty($_POST['message'])) {
        $data = array('success' => false, 'message' => 'Please fill out the form completely.');
        echo json_encode($data);
        exit;
    }

$mail = new PHPMailer;

//$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'secure.emailsrvr.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'info@alizoti.com';                 // SMTP username
$mail->Password = 'SweetBaba';                           // SMTP password
$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587;                                    // TCP port to connect to

$mail->From = $_POST['email'];
    $mail->FromName = $_POST['name'];
    $mail->AddAddress('info@alizoti.com'); //recipient 
    $mail->Subject = 'From Alizoti.com '.  $_POST['type'];
    $mail->Body = "Name: " . $_POST['name'] .  "\r\n\r\nProject Type: "  . $_POST['type'] . "\r\n\r\nEmail: " . $_POST['email'] .  "\r\n\r\nPhone: " . $_POST['phone'] . "\r\n\r\nMessage: " .stripslashes($_POST['message']);

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