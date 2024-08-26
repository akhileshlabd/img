document.getElementById('resize').addEventListener('click', function() {
    const fileInput = document.getElementById('upload');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const widthInput = document.getElementById('width').value;
    const heightInput = document.getElementById('height').value;
    const targetSize = document.getElementById('size').value;
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please upload an image first.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            let width = parseFloat(widthInput);
            let height = parseFloat(heightInput);
            
            // Convert cm to pixels if necessary
            const dpi = 96; // Change this based on desired resolution
            if (widthInput && widthInput.endsWith('cm')) {
                width = (width * dpi) / 2.54;
            }
            if (heightInput && heightInput.endsWith('cm')) {
                height = (height * dpi) / 2.54;
            }

            // Default to original size if no dimensions are provided
            canvas.width = width || img.width;
            canvas.height = height || img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            let quality = 0.9; // Start with high quality
            let dataUrl = canvas.toDataURL('image/jpeg', quality);

            if (targetSize) {
                let fileSize = Math.ceil((dataUrl.length * 3) / 4 / 1024); // Estimate file size in KB
                while (fileSize > targetSize && quality > 0.1) {
                    quality -= 0.1;
                    dataUrl = canvas.toDataURL('image/jpeg', quality);
                    fileSize = Math.ceil((dataUrl.length * 3) / 4 / 1024);
                }
            }

            // Allow download
            document.getElementById('download').addEventListener('click', function() {
                const link = document.createElement('a');
                link.download = 'resized_image.jpg';
                link.href = dataUrl;
                link.click();
            });

            // Show the canvas to preview the result
            canvas.style.display = 'block';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});
