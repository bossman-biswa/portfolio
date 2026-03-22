import React from 'react';
import { FlipWords } from './FlipWords';

const HeroText=()=>{
    return(
        <div className="z-10 my-20
        text-center md:mt-40 md:text-left
        rounded-3xl bg-clip-text">
            {/* Desktop views */}
            <div className="flex-col hidden md:flex c-space ">
                <h1 className="text-4xl font-medium">Hi i'm Biswa</h1>
                <div className="flex flex-col items-start">
                    <p className="text-5xl font-medium
                     text-neutral-300">
                        I'm a passionate developer  <br /></p>
                        <div>
                            <FlipWords words={["Secure", "Modern",
                            "Scalable"]} />
                        </div>
                        <p className="text-4xl font-medium text-neutral-300">
                            Web development  solutions
                        </p>
                </div>
            </div>
            {/* Mobile views */ }
        </div>
    )
}

export default HeroText;
