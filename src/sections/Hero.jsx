import {motion} from 'motion/react';
import React from 'react';
import HeroText from '../components/HeroText';

const Hero=()=>{
    return(
        <div>
            <section className="flex items-start
            justify-center md:items-start
            md:justify-start min-h-screen
            overflow-hidden c-space">
                <HeroText />
            </section>
        </div>
    )
};

export default Hero;