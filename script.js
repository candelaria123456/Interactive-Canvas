    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const circles = [];
    const defaultRadius = 20;
    const minRadius = 5;
    let selectedCircle = null;
    let isDragging = false;
    let offsetX, offsetY;

    // Helper to draw all circles
    function drawCircles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      circles.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fillStyle = c.selected ? 'red' : 'blue';
        ctx.fill();
        ctx.closePath();
      });
    }

    // Helper to check if a point is inside a circle
    function isInsideCircle(x, y, circle) {
      const dx = x - circle.x;
      const dy = y - circle.y;
      return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
    }

    // Mouse click to add/select circle
    canvas.addEventListener('mousedown', function (e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let found = false;

      for (let i = circles.length - 1; i >= 0; i--) {
        if (isInsideCircle(x, y, circles[i])) {
          circles.forEach(c => c.selected = false);
          circles[i].selected = true;
          selectedCircle = circles[i];
          offsetX = x - selectedCircle.x;
          offsetY = y - selectedCircle.y;
          isDragging = true;
          found = true;
          break;
        }
      }

      if (!found) {
        circles.forEach(c => c.selected = false);
        selectedCircle = {
          x: x,
          y: y,
          radius: defaultRadius,
          selected: true
        };
        circles.push(selectedCircle);
      }

      drawCircles();
    });

    // Drag selected circle
    canvas.addEventListener('mousemove', function (e) {
      if (isDragging && selectedCircle) {
        const rect = canvas.getBoundingClientRect();
        selectedCircle.x = e.clientX - rect.left - offsetX;
        selectedCircle.y = e.clientY - rect.top - offsetY;
        drawCircles();
      }
    });

    // Stop drag
    canvas.addEventListener('mouseup', function () {
      isDragging = false;
    });

    // Prevent default scroll behavior inside canvas
    canvas.addEventListener('wheel', function (e) {
      e.preventDefault();
      if (selectedCircle) {
        if (e.deltaY < 0) {
          selectedCircle.radius += 2;
        } else {
          selectedCircle.radius = Math.max(minRadius, selectedCircle.radius - 2);
        }
        drawCircles();
      }
    });

    // Delete with Delete key
    window.addEventListener('keydown', function (e) {
      if (e.key === "Delete" && selectedCircle) {
        const index = circles.indexOf(selectedCircle);
        if (index !== -1) {
          circles.splice(index, 1);
          selectedCircle = null;
          drawCircles();
        }
      }
    });

    // Initial draw
    drawCircles();