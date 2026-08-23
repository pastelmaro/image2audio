const input = document.getElementById("input")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

input.addEventListener("change", (e) => {
    const audioctx = new AudioContext()
    const file = e.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image()
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                let time = audioctx.currentTime;
                let delay = 0;

                for (let y = 0; y < canvas.height; y += 10) {
                    for (let x = 0; x < canvas.width; x += 10) {
                        ctx.fillStyle = "red"; ctx.fillRect(x, y, 10, 10);
                        const index = (y * canvas.width + x) * 4;
                        const r = imageData.data[index];
                        const g = imageData.data[index + 1];
                        const b = imageData.data[index + 2];
                        
                        const brightness = (r + g + b) / 3;

                        const norm = brightness / 255;
                        
                        const last = 200 + (norm * 600);
                        
                        const gainNode = audioctx.createGain();
                        const osc = audioctx.createOscillator();

                        osc.frequency.value = last;
                        osc.connect(gainNode);
                        gainNode.connect(audioctx.destination);
                        gainNode.gain.setValueAtTime(0,time);
                        gainNode.gain.linearRampToValueAtTime(0.5,time + 0.05);
                        gainNode.gain.linearRampToValueAtTime(0,time+0.1);
                        osc.start(time);
                        osc.stop(time + 0.1);
                        time += 0.1;

                        setTimeout(() => {
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                            ctx.fillStyle = "red";
                            ctx.fillRect(x,y,10,10);
                        }, delay);

                        delay += 100;
                    }
                }
            }
                img.src = event.target.result
            }
            reader.readAsDataURL(file)
        }
    })