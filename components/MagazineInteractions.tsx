'use client';

import { useEffect } from 'react';

export default function MagazineInteractions() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    document.querySelectorAll('.magazine-root .fade-in').forEach((el) => {
      observer.observe(el);
    });

    const nav = document.getElementById('magazine-nav');
    const sections = document.querySelectorAll('.magazine-root .section[id]');
    const navLinks = document.querySelectorAll(
      '.magazine-root #magazine-nav a[data-section]'
    );

    const onScroll = () => {
      const scrollY = window.scrollY;

      if (nav) {
        nav.classList.toggle('visible', scrollY > window.innerHeight * 0.7);
      }

      let current = '';
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop - 120;
        if (scrollY >= sectionTop) {
          current = section.id;
        }
      });

      navLinks.forEach((link) => {
        link.classList.toggle(
          'active',
          link.getAttribute('data-section') === current
        );
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return null;
}
