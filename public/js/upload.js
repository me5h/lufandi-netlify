Dropzone.autoDiscover = false;
let myDropzone = new Dropzone("#my-awesome-dropzone", {
    url: "/", // Will be set dynamically
    method: "put",
    autoProcessQueue: false,
});

myDropzone.on("addedfile", function(file) {
    // Send the file name to the server to generate a presigned URL
    fetch('/.netlify/functions/generate-presigned-url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: file.name })
    })
    .then(response => response.json())
    .then(data => {
        file.upload.url = data.url; // Set the presigned URL for uploading
        myDropzone.options.url = data.url; // Update Dropzone's URL to the presigned URL
        myDropzone.processQueue();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

myDropzone.on("sending", function(file, xhr) {
    // Set the content type header to the file's MIME type
    xhr.setRequestHeader('Content-Type', file.type);

    // Override the FormData to send the file as a binary blob
    let _send = xhr.send;
    xhr.send = function() {
        _send.call(xhr, file);
    };
});


myDropzone.on("success", function(file) {
    console.log('File uploaded successfully:', file.name);

    // Use the fileName from the response of the presigned URL function or from the file object
    const fileNameToSend = file.upload.fileName || file.name;

    fetch('/.netlify/functions/upload-notification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: fileNameToSend })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Notification sent:', data.message);
    })
    .catch(error => {
        console.error('Error sending notification:', error);
    });
});

