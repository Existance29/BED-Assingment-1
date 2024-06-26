async function handleSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('courseUploadForm');
    const formData = new FormData(form);

    console.log("Submitting form data:");
    formData.forEach((value, key) => {
        if (value instanceof File) {
            console.log(key + ': ' + value.name + ' (' + value.size + ' bytes)');
        } else {
            console.log(key + ': ' + value);
        }
    });

    try {
        const response = await fetch('/courses', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response from server:', errorData);
            alert(`Error uploading course: ${errorData.message}`);
            return;
        }

        const result = await response.json();
        console.log('Response from server:', result);
        alert('Course uploaded successfully!');
        window.location.href = 'course-chapters.html?courseID=' + result.courseID;
    } catch (error) {
        console.error('Error uploading course:', error);
        alert('Failed to upload course: ' + error.message);
    }
}

document.getElementById('courseUploadForm').addEventListener('submit', handleSubmit);
