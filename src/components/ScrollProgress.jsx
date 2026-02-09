import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();

    // Add spring physics for smooth animation
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-600 origin-left z-50 shadow-lg shadow-primary/50"
            style={{ scaleX }}
        />
    );
};

export default ScrollProgress;
