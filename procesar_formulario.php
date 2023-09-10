<?php
    $nombre = $_POST["nombre"];
    $asunto = $_POST["asunto"];
    $email = $_POST["email"];
    $mensaje = $_POST["mensaje"];

    // Definir cabeceras para el correo
    $header = "MIME-Version: 1.0\r\n";
    $header .= "Content-type: text/html; charset=utf-8\r\n";
    $header .= "From: $email\r\n";

    $destinatario = "richard003800@gmail.com";
    $asunto_email = "Nuevo mensaje desde el formulario de contacto";

    $mensaje_email = "Nombre: $nombre<br>";
    $mensaje_email .= "Asunto: $asunto<br>";
    $mensaje_email .= "Correo Electrónico: $email<br>";
    $mensaje_email .= "Mensaje:<br>$mensaje";

    // Enviar el correo
    if (mail($destinatario, $asunto_email, $mensaje_email, $header)) {
        header("Location: index.html");
    } else {
        echo "Hubo un problema al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.";
    }
?>
