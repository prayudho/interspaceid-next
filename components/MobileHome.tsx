'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import type { PageData } from '@/lib/queries'

export default function MobileHome({ data }: { data: PageData }) {
  const { setting, services, teams, branches, langVars, lang } = data

  const pathimg = '/Assets/img/'
  const pathimg300 = '/Assets/img/'

  const lv = (key: string) => langVars[key] || ''

  const branchList = Object.entries(branches)

  useEffect(() => {
    const init = () => {
      if (typeof window.$ === 'undefined') { setTimeout(init, 100); return }
      const $ = window.$
      // Owl Carousel for team
      if (typeof $.fn.owlCarousel !== 'undefined') {
        $('#teamSlide').owlCarousel({
          loop: true,
          margin: 10,
          nav: true,
          responsive: {
            0: { items: 1 },
            600: { items: 2 },
            1000: { items: 3 },
          },
        })
      }
    }
    init()
  }, [])

  return (
    <>
      <link rel="stylesheet" href="/Assets/plugins/style_mobile.css" />
      <Script src="/Assets/plugins/jquery.min.js" strategy="beforeInteractive" />
      <Script src="/Assets/plugins/bootstrap.min.js" strategy="afterInteractive" />
      <Script src="/Assets/plugins/owl.carousel.min.js" strategy="afterInteractive" />

      {/* Section 1: Home */}
      <section className="section parallax p1" id="homes">
        <div className="container text-center">
          <span className="logoInterspace"></span>
          <p
            className="typewrite is-animated"
            data-period="500"
            data-type={JSON.stringify([lv('text_slider_1') || 'Affiliate Platform and Website Services', lv('text_slider_2') || 'Your Best Digital Partner'])}
          >
            <span className="wrap"></span>
          </p>
        </div>
      </section>

      {/* Section 2: Profile */}
      <section className="section" id="profile">
        <div className="container">
          <span className="logoInterspace"></span>
          <h1 className="is-animated head-section text-center">{lv('menu_about') || 'About Us'}</h1>
          <div dangerouslySetInnerHTML={{ __html: setting.about_us_content }} />
          <div className="borVid mB20">
            <video width="100%" height="100%" preload="none" controls loop>
              <source src={`${pathimg}interspace_indonesia.mp4`} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
            </video>
          </div>
        </div>
      </section>

      {/* Section 3: Our Service */}
      <section className="section" id="ourService">
        <div className="container">
          <div className="relative text-center">
            <h1 className="is-animated">{lv('menu_service') || 'Our Service'}</h1>
            <p className="is-animated big">{lv('our_service_desc') || ''}</p>
          </div>
          {services.map((svc) => (
            <div key={svc.oserId} className="service-item mB20">
              <h2>{svc.oserTitle}</h2>
              <p className="sub">{svc.sub_title}</p>
              <div dangerouslySetInnerHTML={{ __html: svc.description }} />
              <a href={svc.oserUrl} className="btn btn-default" target="_blank" rel="noreferrer">
                {lv('visit_website') || 'Visit Website'}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Partner */}
      <section className="section" id="partner">
        <div className="container">
          <h1 className="is-animated text-center">{lv('menu_partner') || 'Partner'}</h1>
          <div className="row">
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((n) => (
              <span key={n} className="imgCont col-sm-4 col-xs-6">
                <img src={`/Assets/img/c${n}.jpg`} alt={`Partner ${n}`} />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Our Team */}
      <div className="section" id="ourTeam">
        <div className="container">
          <h1 className="is-animated text-center">{lv('menu_ourteams') || 'Our Team'}</h1>
          <div className="slideTeam">
            <div id="teamSlide" className="owl-carousel owl-theme">
              {teams.map((t) => (
                <div key={t.oteaId} className="item">
                  <div className="bioCont is-animated">
                    <div className="imgCont">
                      <img src={`${pathimg300}${t.oteaFoto}`} className="text-center rounded mx-auto d-block" alt={t.oteaName} />
                    </div>
                    <h2 className="text-left">{t.oteaName}<small>{t.oteaPosition}</small></h2>
                    <div className="clearfix"></div>
                    <p dangerouslySetInnerHTML={{ __html: t.history }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Contact Us */}
      <section className="section" id="contactUs">
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
            <div className="tab-content">
              {branchList.map(([code, branchs], i) => (
                <div key={code} id={code} className={`tab-pane fade${i === 0 ? ' in active' : ''}`}>
                  {branchs.map((b) => (
                    <ul key={b.mbraId} className="list-unstyled addressCst">
                      <li><h4>{b.mbraName}</h4></li>
                      <li>
                        <i className="fa fa-map-marker pull-left"></i>
                        <div className="mL25" style={{ whiteSpace: 'pre-line' }}>{b.mbraAddress}</div>
                      </li>
                      {b.mbraPhone && (
                        <li>
                          <i className="fa fa-phone pull-left"></i>
                          <div className="mL25"><a href={`tel:${b.mbraPhone}`}>{b.mbraPhone}</a></div>
                        </li>
                      )}
                      {b.mbraMail && (
                        <li>
                          <i className="fa fa-envelope pull-left"></i>
                          <div className="mL25"><a href={`mailto:${b.mbraMail}`}>{b.mbraMail}</a></div>
                        </li>
                      )}
                    </ul>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="lang-bar">
        <a href="/" className={lang === 'id' ? 'active' : ''}>ID</a>
        <a href="/en" className={lang === 'en' ? 'active' : ''}>EN</a>
      </div>
    </>
  )
}
