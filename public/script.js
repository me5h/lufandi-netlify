// Example of updating an image using a fetch call to a Netlify function
function updateBackgroundImage(imageUrl) {
    fetch('/.netlify/functions/update-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: imageUrl }),
    }).then(response => {
        console.log('Image updated successfully');
        // Additional logic
    }).catch(error => {
        console.error('Error updating image:', error);
    });
}
