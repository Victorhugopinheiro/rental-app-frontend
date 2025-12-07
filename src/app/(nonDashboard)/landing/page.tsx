


import React from 'react'
import HeroSection from './HeroSection'
import FeatureSection from './FeatureSection'
import DiscoverSection from './DiscoverSection'
import CallingForAction from './CallingForAction'
import Footer from './footer'

export default function LandingPage() {
    return (
        <div className='w-full h-full flex flex-col '>

            <HeroSection />

            <FeatureSection />

            <DiscoverSection />

            <CallingForAction/>

            <Footer/>



        </div>
    )
}
