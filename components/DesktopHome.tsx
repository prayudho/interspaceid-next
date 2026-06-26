'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import type { PageData } from '@/lib/queries'

declare global {
  interface Window {
    $: JQueryStatic
    jQuery: JQueryStatic
    particlesJS: (id: string, config: object) => void
  }
}

export default function DesktopHome({ data }: { data: PageData }) {
  const { setting, services, teams, branches, langVars, lang } = data

  const pathimg = '/Assets/img/'
  const pathimg300 = '/Assets/img/'

  const lv = (key: string) => langVars[key] || ''

  useEffect(() => {
    document.body.classList.add('no_overflow')
    return () => document.body.classList.remove('no_overflow')
  }, [])

  useEffect(() => {
    const init = () => {
      if (typeof window.$ === 'undefined' || typeof window.$.fn.fullpage === 'undefined') {
        setTimeout(init, 100)
        return
      }
      const $ = window.$

      function particles(opt: number) {
        if (opt === 1) {
          window.particlesJS('particles-js', {
            particles: {
              number: { value: 2, density: { enable: true, value_area: 455 } },
              color: { value: '#fff' },
              shape: { type: 'polygon', stroke: { width: 0, color: '#fff' }, polygon: { nb_sides: 6 } },
              opacity: { value: 0.2, random: true, anim: { enable: false, speed: 0.5, opacity_min: 0.1, sync: false } },
              size: { value: 160, random: true, anim: { enable: true, speed: 10, size_min: 40, sync: true } },
              line_linked: { enable: false },
              move: { enable: true, speed: 8, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } },
            },
            interactivity: {
              detect_on: 'canvas',
              events: { onhover: { enable: false, mode: 'repulse' }, onclick: { enable: false, mode: 'remove' }, resize: true },
              modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } },
            },
            retina_detect: true,
          })
        }
      }

      const pageCont = $('#fullpage')
      const menu = $('#floatMenu')
      const home = $('#homes')
      const profile = $('#profile')
      const service = $('#ourService')
      const accesstrade = $('#slide2')
      const simpledatafeed = $('#slide3')
      const jurnalApps = $('#slide4')
      const partner = $('#partner')
      const ourTeam = $('#ourTeam')
      const contactus = $('#contactUs')
      const navFloat = $('.navFloat')
      const txt_contact_us = lv('contact_us') || 'Contact Us'

      function introInAnimation() {
        menu.find('li').siblings('li').removeClass('active').eq(0).addClass('active')
        particles(1)
        home.find('.is-animated').each(function (this: HTMLElement, i: number) {
          const delay = 700 + i * 300 + 'ms'
          $(this).addClass('animated fadeInDown').css({ 'animation-delay': delay, opacity: 1 })
        })
      }
      function profileInAnimation() {
        $('.navbar-default').addClass('active')
        menu.find('li').siblings('li').removeClass('active').eq(1).addClass('active')
        profile.find('.is-animated').each(function (this: HTMLElement, i: number) {
          const delay = 700 + i * 200 + 'ms'
          $(this).addClass('animated flipInX').css({ 'animation-delay': delay, opacity: 1 })
        })
      }
      function serviceInAnimation() {
        menu.find('li').siblings('li').removeClass('active').eq(2).addClass('active')
        service.find('.is-animated').eq(0).addClass('animated bounceIn').css({ 'animation-delay': '700ms', opacity: 1 })
        service.find('.is-animated').eq(1).addClass('animated bounceIn').css({ 'animation-delay': '800ms', opacity: 1 })
        service.find('.is-animated').eq(2).addClass('animated bounceIn').css({ 'animation-delay': '900ms', opacity: 1 })
        service.find('.is-animated').eq(3).addClass('animated bounceIn').css({ 'animation-delay': '1100ms', opacity: 1 })
        service.find('.is-animated').eq(4).addClass('animated bounceIn').css({ 'animation-delay': '1300ms', opacity: 1 })
      }
      function accesstradeInAnimation() {
        accesstrade.find('.sideCustom').addClass('animated fadeInLeft').css({ 'animation-delay': '400ms', opacity: 1 })
        accesstrade.find('.breadcrumb').addClass('animated bounceInLeft').css({ 'animation-delay': '700ms', opacity: 1 })
        accesstrade.find('h1').addClass('animated bounceInLeft').css({ 'animation-delay': '900ms', opacity: 1 })
        accesstrade.find('p').addClass('animated bounceInLeft').css({ 'animation-delay': '1100ms', opacity: 1 })
        accesstrade.find('.floatsL').addClass('animated fadeInUp').css({ 'animation-delay': '1300ms', opacity: 1 })
        accesstrade.find('.floatsR').addClass('animated fadeInUp').css({ 'animation-delay': '1400ms', opacity: 1 })
        accesstrade.find('.btn').addClass('animated bounceInLeft').css({ 'animation-delay': '1600ms', opacity: 1 })
        accesstrade.find('.circle').addClass('animated rollIn').css({ 'animation-delay': '1100ms', opacity: 1 })
        accesstrade.find('.ads1').addClass('animated bounceIn').css({ 'animation-delay': '1800ms', opacity: 1 })
        accesstrade.find('.ads2').addClass('animated bounceIn').css({ 'animation-delay': '2200ms', opacity: 1 })
        accesstrade.find('.ads3').addClass('animated bounceIn').css({ 'animation-delay': '2400ms', opacity: 1 })
        accesstrade.find('.ads4').addClass('animated bounceIn').css({ 'animation-delay': '2600ms', opacity: 1 })
        accesstrade.find('.rainbow1').addClass('animated zoomInUp').css({ 'animation-delay': '2600ms', opacity: 1 })
        accesstrade.find('.rainbow2').addClass('animated zoomInUp').css({ 'animation-delay': '2700ms', opacity: 1 })
      }
      function simpledatafeedInAnimation() {
        simpledatafeed.find('.sideCustom').addClass('animated fadeInLeft').css({ 'animation-delay': '400ms', opacity: 1 })
        simpledatafeed.find('.breadcrumb').addClass('animated bounceInLeft').css({ 'animation-delay': '700ms', opacity: 1 })
        simpledatafeed.find('h1').addClass('animated bounceInLeft').css({ 'animation-delay': '900ms', opacity: 1 })
        simpledatafeed.find('p').addClass('animated bounceInLeft').css({ 'animation-delay': '1100ms', opacity: 1 })
        simpledatafeed.find('.floatsL').addClass('animated fadeInUp').css({ 'animation-delay': '1300ms', opacity: 1 })
        simpledatafeed.find('.floatsR').addClass('animated fadeInUp').css({ 'animation-delay': '1400ms', opacity: 1 })
        simpledatafeed.find('.btn').addClass('animated bounceInLeft').css({ 'animation-delay': '1600ms', opacity: 1 })
        simpledatafeed.find('#sdfB').addClass('animated bounceInLeft').css({ 'animation-delay': '1100ms', opacity: 1 })
      }
      function jurnalappsInAnimation() {
        jurnalApps.find('.sideCustom').addClass('animated fadeInLeft').css({ 'animation-delay': '400ms', opacity: 1 })
        jurnalApps.find('.breadcrumb').addClass('animated bounceInLeft').css({ 'animation-delay': '700ms', opacity: 1 })
        jurnalApps.find('h1').addClass('animated bounceInLeft').css({ 'animation-delay': '900ms', opacity: 1 })
        jurnalApps.find('p').addClass('animated bounceInLeft').css({ 'animation-delay': '1100ms', opacity: 1 })
        jurnalApps.find('.floatsL').addClass('animated fadeInUp').css({ 'animation-delay': '1300ms', opacity: 1 })
        jurnalApps.find('.floatsR').addClass('animated fadeInUp').css({ 'animation-delay': '1400ms', opacity: 1 })
        jurnalApps.find('.btn').addClass('animated bounceInLeft').css({ 'animation-delay': '1600ms', opacity: 1 })
        jurnalApps.find('#jaB').addClass('animated bounceInLeft').css({ 'animation-delay': '1100ms', opacity: 1 })
      }
      function partnerInAnimation() {
        menu.find('li').siblings('li').removeClass('active').eq(3).addClass('active')
        partner.find('h1').addClass('animated flipInX').css({ 'animation-delay': '400ms', opacity: 1 })
        $('.hexagon').each(function (this: HTMLElement, i: number) {
          const delay = 400 + i * 50 + 'ms'
          $(this).addClass('animated zoomIn').css({ 'animation-delay': delay, opacity: 1 })
        })
      }
      function ourteamInAnimation() {
        menu.find('li').siblings('li').removeClass('active').eq(4).addClass('active')
        ourTeam.find('h1').addClass('animated bounceInDown').css({ 'animation-delay': '300ms', opacity: 1 })
        ourTeam.find('#team1 .big').addClass('animated fadeInLeft').css({ 'animation-delay': '400ms', opacity: 1 })
        ourTeam.find('#team1 .bioCont').addClass('animated bounceInRight').css({ 'animation-delay': '600ms', opacity: 1 })
        ourTeam.find('#team1 .bioCont p').addClass('animated bounceInRight').css({ 'animation-delay': '800ms', opacity: 1 })

        $('.nav-tabs .imgCont').on('click', function (this: HTMLElement) {
          const tab_id = $(this).attr('data-tab') as string
          ourTeam.find('.tab-content').removeClass('active').siblings('#' + tab_id).addClass('active')
          ourTeam.find('.list-team').removeClass('active').siblings('#' + tab_id + '_avatar').addClass('active')
          ourTeam.find('.big').removeClass('animated fadeInLeft')
          $('#' + tab_id + ' .big').addClass('animated fadeInLeft').css({ 'animation-delay': '400ms', opacity: 1 })
          ourTeam.find('.bioCont').removeClass('animated bounceInRight')
          $('#' + tab_id + ' .bioCont').addClass('animated bounceInRight').css({ 'animation-delay': '600ms', opacity: 1 })
          $('#' + tab_id + ' .bioCont p').addClass('animated bounceInRight').css({ 'animation-delay': '800ms', opacity: 1 })
        })
      }
      function contactusInAnimation() {
        menu.find('li').siblings('li').removeClass('active').eq(5).addClass('active')
        contactus.find('h1').addClass('animated bounceInLeft').css({ 'animation-delay': '300ms', opacity: 1 })
        contactus.find('#ina .addressCst').addClass('animated bounceInLeft').css({ 'animation-delay': '600ms', opacity: 1 })
        contactus.find('.imgCont').addClass('animated bounceInRight').css({ 'animation-delay': '900ms', opacity: 1 })
        $('.point').each(function (this: HTMLElement, i: number) {
          const delay = 1200 + i * 100 + 'ms'
          $(this).addClass('animated bounceInDown').css({ 'animation-delay': delay, opacity: 1 })
          setTimeout(() => { $('.point#indonesia').addClass('bounceEffect') }, 2500)
        })
        contactus.find('.point').on('click', function (this: HTMLElement) {
          const tab_id = $(this).attr('data-tab') as string
          if (tab_id !== 'ina') {
            $('.cntTitle').text('Interspace Worldwide')
          } else {
            $('.cntTitle').text(txt_contact_us)
          }
          contactus.find('.tab-content').removeClass('active').siblings('#' + tab_id).addClass('active')
          contactus.find('.addressCst').removeClass('animated bounceInLeft')
          $('#' + tab_id + ' .addressCst').addClass('animated bounceInLeft').css({ 'animation-delay': '600ms', opacity: 1 })
          $(this).addClass('bounceEffect').siblings('.point').removeClass('bounceEffect bounceInDown')
        })
      }
      function contactusOutAnimation() {
        $('.cntTitle').text(txt_contact_us)
        $('.point').removeClass('bounceEffect').addClass('bounceInDown')
        $('.point#indonesia').addClass('bounceEffect')
        contactus.find('.tab-content').removeClass('active').siblings('#ina').addClass('active')
          .find('.addressCst').removeClass('animated bounceInLeft').css({ 'animation-delay': '600ms', opacity: 0 })
      }

      function fullPage() {
        $('#fullpage').fullpage({
          menu: '#menu',
          controlArrows: false,
          slidesNavigation: true,
          onLeave: function (_index: number, nextIndex: number) {
            if (nextIndex === 1) { $('.navbar-default').removeClass('active') }
            if (_index === 6) { contactusOutAnimation() }
          },
          afterRender: function () { introInAnimation() },
          afterLoad: function (_anchorLink: unknown, index: number) {
            menu.find('li').siblings('li').removeClass('active').eq(0).addClass('active')
            if (index === 1) { menu.find('li').siblings('li').removeClass('active').eq(0).addClass('active'); $('.navbar-default').removeClass('active') }
            if (index === 2 && profile.hasClass('active')) { profileInAnimation() }
            if (index === 3 && service.hasClass('active')) { serviceInAnimation() }
            if (index === 4 && partner.hasClass('active')) { partnerInAnimation() }
            if (index === 5 && ourTeam.hasClass('active')) { ourteamInAnimation() }
            if (index === 6 && contactus.hasClass('active')) { contactusInAnimation() }
          },
          afterSlideLoad: function (_anchorLink: unknown, index: number, _slideAnchor: unknown, slideIndex: number) {
            if (index === 3 && slideIndex === 1) { accesstradeInAnimation() }
            if (index === 3 && slideIndex === 2) { simpledatafeedInAnimation() }
            if (index === 3 && slideIndex === 3) { jurnalappsInAnimation() }
          },
          afterSlideLeave: function (_anchorLink: unknown, index: number, slideIndex: number) {
            if (index === 3 && slideIndex === 1) { accesstradeInAnimation() }
            if (index === 3 && slideIndex === 2) { simpledatafeedInAnimation() }
            if (index === 3 && slideIndex === 3) { jurnalappsInAnimation() }
          },
        })
      }

      // Typewriter
      function TxtType(el: HTMLElement, toRotate: string[], period: number) {
        let loopNum = 0, txt = '', isDeleting = false
        function tick() {
          const i = loopNum % toRotate.length
          const fullTxt = toRotate[i]
          txt = isDeleting ? fullTxt.substring(0, txt.length - 1) : fullTxt.substring(0, txt.length + 1)
          el.innerHTML = '<span class="wrap">' + txt + '</span>'
          let delta = 120 - Math.random() * 100
          if (isDeleting) delta /= 2
          if (!isDeleting && txt === fullTxt) { delta = period; isDeleting = true }
          else if (isDeleting && txt === '') { isDeleting = false; loopNum++; delta = 500 }
          setTimeout(tick, delta)
        }
        tick()
      }
      document.querySelectorAll<HTMLElement>('.typewrite').forEach((el) => {
        const toRotate = el.getAttribute('data-type')
        const period = parseInt(el.getAttribute('data-period') || '1000', 10)
        if (toRotate) TxtType(el, JSON.parse(toRotate), period)
      })
      const css = document.createElement('style')
      css.innerHTML = '.typewrite > .wrap { border-right: 0.08em solid #fff }'
      document.body.appendChild(css)

      // pageLoading equivalent
      $('.loadings').hide()
      pageCont.show()
      fullPage()

      // Event handlers
      $('[data-toggle="tooltip"]').tooltip()
      $('.overBtns').find('.fa').on('click', function (this: HTMLElement) {
        $('.overlay-cont').show()
        $('.side_menu').velocity({ right: 0 }, { duration: 100, delay: 50, easing: 'swing' })
        $(this).hide().parents('.float-bottom').addClass('on')
        $('.close_side_menu').show()
        navFloat.removeClass('slideDown')
        $.fn.fullpage.setAllowScrolling(false)
      })
      $('.close_side_menu').on('click', function (this: HTMLElement) {
        $('.overlay-cont').hide()
        $('.side_menu').velocity({ right: '-270px' }, { duration: 100, delay: 50, easing: 'easeIn' })
        $('.overBtns .fa-bars').show().parents('.float-bottom').removeClass('on')
        $('.close_side_menu').hide()
        navFloat.addClass('slideDown')
        $.fn.fullpage.setAllowScrolling(true)
      })
      $('.sld').on('click', function (this: HTMLElement) {
        const me = $(this).attr('rel')
        $.fn.fullpage.moveTo(3, me)
      })
      $('.mnu').on('click', function (this: HTMLElement) {
        const me = $(this).attr('rel')
        $.fn.fullpage.moveTo(me)
      })
    }
    init()
    return () => {
      if (typeof window.$ !== 'undefined' && typeof window.$.fn.fullpage !== 'undefined') {
        try { window.$.fn.fullpage.destroy('all') } catch (_) { /* ignore */ }
      }
    }
  }, [])

  const s0 = services[0]
  const s1 = services[1]
  const s2 = services[2]

  const branchList = Object.entries(branches)

  return (
    <>
      <link rel="stylesheet" href="/Assets/plugins/style_desktop.css" />
      <Script src="/Assets/plugins/jquery.min.js" strategy="beforeInteractive" />
      <Script src="/Assets/plugins/bootstrap.min.js" strategy="beforeInteractive" />
      <Script src="/Assets/plugins/imagesloaded.pkgd.min.js" strategy="afterInteractive" />
      <Script src="/Assets/plugins/jquery.fullpage.min.js" strategy="afterInteractive" />
      <Script src="/Assets/plugins/scrolloverflow.min.js" strategy="afterInteractive" />
      <Script src="/Assets/plugins/jquery.velocity.min.js" strategy="afterInteractive" />
      <Script src="/Assets/plugins/jquery.typer.js" strategy="afterInteractive" />
      <Script src="/Assets/plugins/particles.min.js" strategy="afterInteractive" />

      {/* Floating nav */}
      <div className="navFloat slideDown">
        <nav className="navbar navbar-default" id="floatMenu">
          <ul id="menu">
            <li className="active"><a className="mnu" rel="1" href="#home">{lv('menu_home') || 'Home'}</a></li>
            <li><a className="mnu" rel="2" href="#profile">{lv('menu_about') || 'About Us'}</a></li>
            <li><a className="mnu" rel="3" href="#ourService">{lv('menu_service') || 'Services'}</a></li>
            <li><a className="mnu" rel="4" href="#partner">{lv('menu_partner') || 'Partner'}</a></li>
            <li><a className="mnu" rel="5" href="#team">{lv('menu_ourteam') || 'Our Team'}</a></li>
            <li><a className="mnu" rel="6" href="#contactUs">{lv('menu_contactus') || 'Contact Us'}</a></li>
          </ul>
        </nav>
      </div>

      <div id="fullpage">
        {/* Section 1: Home */}
        <div className="section fp-noscroll" id="homes">
          <div id="particles-js"></div>
          <div className="container text-center">
            <span className="logoInterspace"></span>
            <p
              className="typewrite is-animated"
              data-period="500"
              data-type={JSON.stringify([lv('text_slider_1') || 'Affiliate Platform and Website Services', lv('text_slider_2') || 'Your Best Digital Partner'])}
            >
              <span className="wrap"></span>
            </p>
            <div className="is-animated mnu scrlLeft scroll" rel="2" data-toggle="tooltip" title="Mouse Scroll Down"></div>
          </div>
        </div>

        {/* Section 2: Profile */}
        <div className="section" id="profile">
          <div className="container">
            <span className="logoInterspace"></span>
            <h1 className="is-animated head-section text-center">{lv('menu_about') || 'About Us'}</h1>
            <div dangerouslySetInnerHTML={{ __html: setting.about_us_content }} />
            <div className="borVid mB20">
              <video width="100%" height="100%" preload="none" controls loop>
                <source src={`${pathimg}interspace_indonesia.mp4`} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                <source src={`${pathimg}interspace_indonesia.mp4`} type='video/ogg; codecs="theora, vorbis"' />
                <source src={`${pathimg}interspace_indonesia.mp4`} type='video/webm; codecs="vp8, vorbis"' />
              </video>
            </div>
          </div>
        </div>

        {/* Section 3: Our Service (slides) */}
        <div className="section" id="ourService">
          <div className="container">
            <div className="relative text-center">
              <h1 className="is-animated">{lv('menu_service') || 'Our Service'}</h1>
              <p className="is-animated big">{lv('our_service_desc') || ''}</p>
              <div id="accesstrade">
                {services.map((svc, idx) => (
                  <a key={svc.oserId} className="sld is-animated" rel={String(idx + 1)}>
                    {svc.oserTitle}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Service Slide 1 */}
          {s0 && (
            <div className="slide" id="slide2">
              <div className="sideCustom"></div>
              <div className="container">
                <ol className="breadcrumb">
                  <li>{lv('menu_service') || 'Service'}</li>
                  <li className="active">{s0.oserTitle}</li>
                </ol>
                <h1>{s0.oserTitle}</h1>
                <p className="sub">{s0.sub_title}</p>
                <div className="row">
                  <div className="floatsL col-sm-5">
                    <div dangerouslySetInnerHTML={{ __html: s0.description }} />
                    <a href={s0.oserUrl} className="btn btn-default otherLink" target="_blank" rel="noreferrer">
                      {lv('visit_website') || 'Visit Website'}
                    </a>
                  </div>
                  <div className="floatsR col-sm-7">
                    <div className="circle"><img src={`${pathimg}${s0.oserImage}`} alt={s0.oserTitle} /></div>
                    <span className="ads1"></span><span className="ads2"></span>
                    <span className="ads3"></span><span className="ads4"></span>
                    <span className="rainbow1"></span><span className="rainbow2"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Service Slide 2 */}
          {s1 && (
            <div className="slide" id="slide3">
              <div className="sideCustom"></div>
              <div className="container">
                <ol className="breadcrumb">
                  <li>{lv('menu_service') || 'Service'}</li>
                  <li className="active">{s1.oserTitle}</li>
                </ol>
                <h1>{s1.oserTitle}</h1>
                <p className="sub">{s1.sub_title}</p>
                <div className="row">
                  <div className="floatsL col-sm-5">
                    <div dangerouslySetInnerHTML={{ __html: s1.description }} />
                    <a href={s1.oserUrl} className="btn btn-default otherLink" target="_blank" rel="noreferrer">
                      {lv('visit_website') || 'Visit Website'}
                    </a>
                  </div>
                  <div className="floatsR col-sm-7" id="sdfB">
                    <span className="paper1"></span><span className="paper2"></span>
                    <span className="paper3"></span><span className="print1"></span>
                    <span className="print2"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Service Slide 3 */}
          {s2 && (
            <div className="slide" id="slide4">
              <div className="sideCustom"></div>
              <div className="container">
                <ol className="breadcrumb">
                  <li>{lv('menu_service') || 'Service'}</li>
                  <li className="active">{s2.oserTitle}</li>
                </ol>
                <h1>{s2.oserTitle}</h1>
                <p className="sub">{s2.sub_title}</p>
                <div className="row">
                  <div className="floatsL col-sm-5">
                    <div dangerouslySetInnerHTML={{ __html: s2.description }} />
                    <a href={s2.oserUrl} className="btn btn-default otherLink" target="_blank" rel="noreferrer">
                      {lv('visit_website') || 'Visit Website'}
                    </a>
                  </div>
                  <div className="floatsR col-sm-7" id="jaB">
                    <span className="phone-ja"></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Partner */}
        <div className="section" id="partner">
          <div className="container">
            <h1 className="is-animated text-center">{lv('menu_partner') || 'Partner'}</h1>
            <div className="partnerGrid">
              {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((n) => (
                <span key={n} className="hexagon imgCont">
                  <img src={`/Assets/img/c${n}.jpg`} alt={`Partner ${n}`} />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Our Team */}
        <div className="section" id="ourTeam">
          <div className="container">
            <h1 className="is-animated text-center">{lv('menu_ourteam') || 'Our Team'}</h1>
            {teams.length > 0 && (
              <>
                <ul className="nav nav-tabs list-team" id="team1_avatar">
                  {teams.map((t) => (
                    <li key={t.oteaId} className="imgCont" data-tab={`team${t.oteaId}`}>
                      <img src={`${pathimg300}${t.oteaAvatar}`} alt={t.oteaName} className="rounded-circle" />
                    </li>
                  ))}
                </ul>
                {teams.map((t, i) => (
                  <div key={t.oteaId} id={`team${t.oteaId}`} className={`tab-content${i === 0 ? ' active' : ''}`}>
                    <div className="row">
                      <div className="big col-sm-5">
                        <img src={`${pathimg300}${t.oteaFoto}`} alt={t.oteaName} className="img-responsive" />
                      </div>
                      <div className="bioCont col-sm-7">
                        <h2>{t.oteaName}<small>{t.oteaPosition}</small></h2>
                        <div className="clearfix"></div>
                        <p dangerouslySetInnerHTML={{ __html: t.history }} />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Section 6: Contact Us */}
        <div className="section" id="contactUs">
          <div className="container">
            <h1 className="cntTitle text-center is-animated">{lv('contact_us') || 'Contact Us'}</h1>
            <div className="contInner">
              <ul className="nav nav-tabs">
                {branchList.map(([code], i) => (
                  <li key={code} className={i === 0 ? 'active' : ''}>
                    <a data-toggle="tab" href={`#${code}`}>
                      <i className={`famfamfam-flag-${code}`}></i>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="imgCont mapImg"></div>
              <div className="tab-content-wrap">
                {branchList.map(([code, branchs], i) => (
                  <div key={code} id={code} className={`tab-pane fade${i === 0 ? ' in active' : ''}`}>
                    {branchs.map((b) => (
                      <ul key={b.mbraId} className="list-unstyled addressCst is-animated">
                        <li><h4>{b.mbraName}</h4></li>
                        <li>
                          <i className="fa fa-map-marker mT0 pull-left"></i>
                          <div className="mL25">{b.mbraAddress}</div>
                        </li>
                        <li>
                          <i className="fa fa-phone pull-left"></i>
                          <div className="mL25">
                            <a href={`tel:${b.mbraPhone}`}>{b.mbraPhone}</a>
                          </div>
                        </li>
                        {b.mbraMail && (
                          <li>
                            <i className="fa fa-envelope pull-left"></i>
                            <div className="mL25">
                              <a href={`mailto:${b.mbraMail}`}>{b.mbraMail}</a>
                            </div>
                          </li>
                        )}
                      </ul>
                    ))}
                  </div>
                ))}
              </div>
              <div className="mapPoints">
                {branchList.map(([code], i) => (
                  <span
                    key={code}
                    id={code === 'ina' ? 'indonesia' : code}
                    className={`point ${i === 0 ? 'bounceEffect' : ''}`}
                    data-tab={code}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side menu overlay */}
      <div className="overlay-cont"></div>
      <div className="side_menu">
        <div className="close_side_menu"><i className="fa fa-times"></i></div>
        <ul>
          <li><a className="mnu" rel="1">Home</a></li>
          <li><a className="mnu" rel="2">{lv('menu_about') || 'About Us'}</a></li>
          <li><a className="mnu" rel="3">{lv('menu_service') || 'Services'}</a></li>
          <li><a className="mnu" rel="4">{lv('menu_partner') || 'Partner'}</a></li>
          <li><a className="mnu" rel="5">{lv('menu_ourteam') || 'Our Team'}</a></li>
          <li><a className="mnu" rel="6">{lv('contact_us') || 'Contact Us'}</a></li>
        </ul>
      </div>
      <div className="float-bottom">
        <div className="overBtns"><i className="fa fa-bars"></i></div>
      </div>
      <div className="social-bar">
        {setting.gsetFb && <a href={setting.gsetFb} target="_blank" rel="noreferrer"><i className="fa fa-facebook"></i></a>}
        {setting.gsetTwitter && <a href={setting.gsetTwitter} target="_blank" rel="noreferrer"><i className="fa fa-twitter"></i></a>}
        {setting.gsetInstagram && <a href={setting.gsetInstagram} target="_blank" rel="noreferrer"><i className="fa fa-instagram"></i></a>}
      </div>
      <div className="lang-bar">
        <a href="/" className={lang === 'id' ? 'active' : ''}>ID</a>
        <a href="/en" className={lang === 'en' ? 'active' : ''}>EN</a>
      </div>
    </>
  )
}
