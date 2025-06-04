import React from 'react'
import { Panel } from 'primereact/panel'
const About = () => {
    return (
        <div className="about-page-wrapper">
            <Panel className="about-panel">
                <div className="about-content-container">
                    
                    <h1 className="about-title">About Keren Y&Y</h1>
                    
                    <section className="about-section introduction flex flex-column md:flex-row align-items-center justify-content-center gap-5 mb-5">
                        <div className="md:col-6 text-section">
                            <p>
                                Welcome to Keren Y&Y, a non-profit organization dedicated to making a tangible difference in the lives of those facing hardship. Founded on principles of compassion and community support, we strive to alleviate suffering and empower individuals and families to achieve greater stability and well-being.
                            </p>
                            <p>
                                Our mission is simple yet profound: to extend a helping hand where it's most needed. Through targeted initiatives and unwavering commitment, we aim to create a brighter future for the vulnerable members of our society.
                            </p>
                        </div>
                        <div className="md:col-6 image-section">
                             <img 
                                src="hands.png" 
                                alt="Helping hands" 
                                className="about-image" 
                            /> 
                         </div> 
                    </section>

                    <section className="about-section our-vision flex flex-column-reverse md:flex-row align-items-center justify-content-center gap-5 mb-5">
                         <div className="md:col-6 image-section">
                            <img 
                                src="community.png" 
                                alt="Community support" 
                                className="about-image" 
                            />
                        </div>
                        <div className="md:col-6 text-section">
                            <h3 className="section-title">Our Vision</h3>
                            <p>
                                We envision a world where every individual has access to the resources and support they need to thrive, free from the burdens of poverty and despair. Keren Y&Y is committed to building resilient communities and fostering a culture of generosity and mutual respect.
                            </p>
                            <p>
                                Our efforts are focused on sustainable solutions, comprehensive aid, and fostering self-sufficiency. We believe that by investing in people, we are investing in a better tomorrow for all.
                            </p>
                        </div>
                    </section>

                </div>
            </Panel>
        </div>
    )
}

export default About