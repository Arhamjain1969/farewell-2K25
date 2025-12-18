// ============================================================
// TEACHER INVITATION CARD SCRIPT - AURELIA
// ============================================================

// Display teacher information
window.addEventListener('DOMContentLoaded', function() {
    const name = localStorage.getItem('teacherName');
    const subject = localStorage.getItem('teacherSubject');
    const designation = localStorage.getItem('teacherDesignation');

    // Validate data exists
    if (!name || !subject) {
        // Redirect back to form if no data
        window.location.href = 'teacher-form.html';
        return;
    }

    // Update card with teacher info
    document.getElementById('displayName').textContent = name;
    document.getElementById('displaySubject').textContent = subject;
    
    // Display designation if provided
    const designationElement = document.getElementById('displayDesignation');
    if (designation && designation.trim() !== '') {
        // Format designation with proper capitalization
        const formattedDesignation = formatDesignation(designation);
        designationElement.textContent = formattedDesignation;
        designationElement.style.display = 'block';
    } else {
        designationElement.style.display = 'none';
    }

    // Set current date
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('cardDate').textContent = dateString;

    // Add scroll reveal animation
    addScrollAnimation();
});

// Format designation for proper display
function formatDesignation(designation) {
    // List of titles that should be fully capitalized
    const allCapsWords = ['HOD', 'PGT', 'TGT', 'PRT'];
    
    // Convert to proper case
    const words = designation.split(' ');
    const formatted = words.map(word => {
        const upperWord = word.toUpperCase();
        if (allCapsWords.includes(upperWord)) {
            return upperWord;
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
    
    return formatted;
}

// Print card functionality
function printCard() {
    window.print();
}

// Download card as image (using html2canvas if available, otherwise as PDF)
function downloadCard() {
    const name = localStorage.getItem('teacherName');
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `teacher-invitation-${name.replace(/\s+/g, '-')}-${timestamp}`;

    // Try to use html2canvas library if available
    if (typeof html2canvas !== 'undefined') {
        downloadAsImage(filename);
    } else {
        // Fallback: Print to PDF
        downloadAsPDF(filename);
    }
}

// Download as image using html2canvas
function downloadAsImage(filename) {
    const card = document.querySelector('.farewell-card');
    
    // Create a temporary div for html2canvas
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'fixed';
    tempDiv.style.top = '0';
    tempDiv.style.left = '0';
    tempDiv.style.width = card.offsetWidth + 'px';
    tempDiv.style.height = card.offsetHeight + 'px';
    tempDiv.style.background = getComputedStyle(document.body).background;
    tempDiv.innerHTML = card.innerHTML;
    document.body.appendChild(tempDiv);

    // Canvas conversion
    html2canvas(tempDiv, {
        backgroundColor: 'linear-gradient(135deg, #1a0a3e 0%, #2d1b69 25%, #1e5a8f 50%, #2d1b69 75%, #1a0a3e 100%)',
        scale: 2,
        useCORS: true,
        logging: false
    }).then(canvas => {
        // Create download link
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${filename}.png`;
        link.click();
        
        // Clean up
        document.body.removeChild(tempDiv);
    }).catch(err => {
        console.error('Download failed:', err);
        alert('Unable to download image. Please try printing instead.');
        document.body.removeChild(tempDiv);
    });
}

// Fallback: Download as PDF
function downloadAsPDF(filename) {
    // Using browser's print-to-PDF feature
    const printWindow = window.open('', '', 'width=800,height=600');
    
    const card = document.querySelector('.farewell-card');
    const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
    
    let html = '<html><head><meta charset="UTF-8">';
    
    // Copy all styles
    styles.forEach(style => {
        if (style.tagName === 'LINK') {
            html += `<link rel="stylesheet" href="${style.href}">`;
        } else {
            html += `<style>${style.innerHTML}</style>`;
        }
    });
    
    html += `</head><body style="margin: 20px; background: linear-gradient(135deg, #1a0a3e 0%, #2d1b69 25%, #1e5a8f 50%, #2d1b69 75%, #1a0a3e 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center;">`;
    html += card.outerHTML;
    html += '</body></html>';
    
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Trigger print dialog
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// Go back to form
function goBack() {
    window.location.href = 'teacher-form.html';
}

// Add scroll animation reveal
function addScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'contentReveal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.farewell-card > *').forEach(el => {
        if (el !== document.querySelector('.farewell-card::before')) {
            observer.observe(el);
        }
    });
}

// Easter egg: Keyboard shortcut
document.addEventListener('keydown', function(e) {
    // Press 'S' to share (opens sharing options)
    if (e.key === 's' || e.key === 'S') {
        if (navigator.share) {
            const name = localStorage.getItem('teacherName');
            navigator.share({
                title: 'AURELIA Farewell Invitation',
                text: `Farewell invitation for ${name}`,
                url: window.location.href
            }).catch(err => console.log('Share failed:', err));
        }
    }
});

// Mobile-friendly adjustments
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // Adjust animations for mobile
    document.querySelectorAll('[style*="animation"]').forEach(el => {
        const style = el.getAttribute('style');
        if (style) {
            el.setAttribute('style', style.replace(/(\d+)s/g, (match, p1) => {
                return Math.round(p1 * 0.7) + 's';
            }));
        }
    });
}
