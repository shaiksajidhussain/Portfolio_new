'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'
import { testimonials } from '../data/testimonialsData'
import { useTheme } from '../context/ThemeContext'
import styled, { keyframes } from 'styled-components'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

const Container = styled.div<{ $theme: string; $customBackground: string | null }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
  padding: 80px 0;
  min-height: 100vh;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  background: ${props => props.$customBackground ? `url(${props.$customBackground}) center/cover no-repeat` : props.$theme};
`

const Wrapper = styled.div`
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%,30% 98%, 0 100%);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  gap: 12px;
  padding: 40px 0;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`

const glow = keyframes`
  0% {
    box-shadow: 0 0 0px 0px #854ce6, 0 0 0px 0px #5edfff33;
  }
  50% {
    box-shadow: 0 0 8px 2px #854ce6, 0 0 16px 4px #5edfff33;
  }
  100% {
    box-shadow: 0 0 0px 0px #854ce6, 0 0 0px 0px #5edfff33;
  }
`

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
`

const TestimonialCard = styled(motion.div)`
  background: rgba(35, 35, 54, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(133, 76, 230, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #854ce6 0%, #5edfff 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(133, 76, 230, 0.4);
    box-shadow: 0 8px 32px rgba(133, 76, 230, 0.2);

    &::before {
      opacity: 1;
    }
  }
`

const AvatarContainer = styled.div`
  position: relative;
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  overflow: hidden;
  margin-right: 1rem;
  border: 2px solid #854ce6;
  animation: ${glow} 2s infinite;
`

const QuoteIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #854ce6;
  opacity: 0.2;
  transform: scale(2);
  transition: all 0.3s ease;

  ${TestimonialCard}:hover & {
    opacity: 0.4;
    transform: scale(2.2);
  }
`

const Testimonials = () => {
  const { currentTheme, customBackground } = useTheme()

  return (
    <Container 
      id="testimonials" 
      $theme={currentTheme}
      $customBackground={customBackground}
    >
      <Wrapper>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-primary mb-4">Testimonials</h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            What people say about working with me
          </p>
        </motion.div>

        <Swiper
          modules={[Pagination, Autoplay, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          spaceBetween={30}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="testimonials-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <TestimonialCard
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <QuoteIcon>
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </QuoteIcon>
                <div className="flex items-center mb-6">
                  <AvatarContainer>
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </AvatarContainer>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{testimonial.name}</h3>
                    <p className="text-primary text-sm font-medium">{testimonial.jobTitle}</p>
                    <p className="text-gray-400 text-sm">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-300 flex-grow leading-relaxed">{testimonial.quote}</p>
              </TestimonialCard>
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx global>{`
          .testimonials-swiper {
            padding: 50px 0;
            width: 100%;
          }
          .swiper-pagination-bullet {
            background: #854ce6 !important;
            opacity: 0.5;
            transition: all 0.3s ease;
          }
          .swiper-pagination-bullet-active {
            background: #854ce6 !important;
            opacity: 1;
            transform: scale(1.2);
          }
          .swiper-slide {
            opacity: 0.4;
            transform: scale(0.8);
            transition: all 0.3s ease;
          }
          .swiper-slide-active {
            opacity: 1;
            transform: scale(1);
          }
        `}</style>
      </Wrapper>
    </Container>
  )
}

export default Testimonials
