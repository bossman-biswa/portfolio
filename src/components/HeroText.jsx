import React from 'react';
import { FlipWords } from './FlipWords';
import { motion } from 'motion/react';
 



const HeroText=()=>{
    const words=["Secure", "Modern", "Scalable"];
    return(
        <div className="z-10 my-20
        text-center md:mt-40 md:text-left
        rounded-3xl bg-clip-text">
            {/* Desktop views */}
            <div className="flex-col hidden md:flex c-space ">
                <motion.h1 className="text-4xl font-medium"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}>
                Hi i'm Biswa</motion.h1>
                <div className="flex flex-col items-start">
                    <motion.p className="text-5xl font-medium
                     text-neutral-300">
                        I'm a passionate developer  <br /></motion.p>
                        <motion.div>
                            <FlipWords words={words}
                            className="font-black  text-white text-8xl" />
                        </motion.div  >
                        <motion.p className="text-4xl font-medium text-neutral-300">
                            Web development  solutions
                        </motion.p>
                </div>
            </div>
            {/* Mobile views */}
            <div className="flex-col flex md:hidden c-space ">
                <motion.h1 className="text-2xl font-medium"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}>
                Hi i'm Biswa</motion.h1>
                <div className="flex flex-col items-start">
                    <motion.p className="text-2xl font-medium
                     text-neutral-300">
                        I'm a passionate<br />developer</motion.p>
                        <motion.div>
                            <FlipWords words={words}
                            className="font-black  text-white text-4xl" />
                        </motion.div>
                        <motion.p className="text-lg font-medium text-neutral-300">
                            Web solutions
                        </motion.p>
                </div>
            </div>
        </div>
    )
};

export default HeroText;
