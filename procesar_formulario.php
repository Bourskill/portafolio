<?php

    $nombre = $_POST["nombre"];
    $asunto = $_POST["asunto"];
    $email = $_POST["email"];
    $mensaje = $_POST["mensaje"];

    $destinatario = "richard003800@gmail.com"; 
    $asunto_email = "Nuevo mensaje desde el formulario de contacto";

    $mensaje_email = "Nombre: $nombre\n";
    $mensaje_email .= "Asunto: $asunto\n";
    $mensaje_email .= "Correo Electrónico: $email\n";
    $mensaje_email .= "Mensaje:\n $mensaje";

    mail($destinatario, $asunto_email, utf8_decode($mensaje_email) , $header);

    header("Location: index.html");

?>
