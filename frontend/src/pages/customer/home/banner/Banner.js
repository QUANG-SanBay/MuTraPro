import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Banner.module.scss';

function Banner() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 512;

        // Music notes configuration
        const notes = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];
        const particles = [];

        class MusicNote {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -50;
                this.size = Math.random() * 30 + 20;
                this.speed = Math.random() * 0.05 + 0.3;
                this.note = notes[Math.floor(Math.random() * notes.length)];
                this.opacity = Math.random() * 0.5 + 0.3;
                this.swing = 0; // Bắt đầu từ 0
                this.swingSpeed = Math.random() * 0.008 + 0.004; // Tốc độ swing
                this.swingAmplitude = Math.random() * 40 + 30; // Biên độ dao động 30-70px
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
                this.rotation = Math.random() * Math.PI * 2;
            }

            update() {
                this.y += this.speed;
                this.swing += this.swingSpeed;
                this.rotation += this.rotationSpeed;
                
                // Sử dụng easeInOutSine cho chuyển động ngang mượt mà (nhanh dần → chậm dần)
                const sineValue = Math.sin(this.swing);
                const easeValue = sineValue * Math.abs(sineValue); // x² giữ dấu, tạo ease in-out
                this.x += easeValue * this.swingAmplitude * 0.02;

                if (this.y > canvas.height + 50) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.font = `${this.size}px Arial`;
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.note, 0, 0);
                ctx.restore();
            }
        }

        // Create particles
        for (let i = 0; i < 25; i++) {
            particles.push(new MusicNote());
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        }

        animate();

        // Handle resize
        const handleResize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = 512;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <section className={styles.banner}>
            <canvas ref={canvasRef} className={styles.canvas} />
            
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        Tạo nên bản nhạc <br />
                        của riêng bạn
                    </h1>
                    <p className={styles.subtitle}>
                        <span className={styles.highlight}>Ký âm</span>
                        <span className={styles.dot}>●</span>
                        <span className={styles.highlight}>Phối khí</span>
                        <span className={styles.dot}>●</span>
                        <span className={styles.highlight}>Thu âm</span>
                    </p>
                    <p className={styles.description}>
                        Nền tảng sản xuất âm nhạc trọn gói. Gửi yêu cầu, theo dõi tiến độ, phê duyệt sản phẩm — tất cả trong một.
                    </p>
                    <div className={styles.actions}>
                        <Link to="/services" className={styles.btnPrimary}>
                            Bắt đầu ngay
                        </Link>
                        <Link to="/demo" className={styles.btnSecondary}>
                            Xem quy trình
                        </Link>
                    </div>
                </div>

                <div className={styles.visual}>
                    <div className={styles.card}>
                        <div className={styles.demoButton}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <span>Xem demo</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Banner;
