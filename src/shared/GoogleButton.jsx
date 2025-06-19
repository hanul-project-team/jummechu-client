import React from 'react'
import { useEffect } from 'react'

const GoogleButton = ({ className, value, onLogin }) => {
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: onLogin,
      })
    }
  }, [onLogin])
  const handleClick = () => {
    if (window.google) {
      window.google.accounts.id.prompt()
    }
  }
  return (
    <button
      onClick={handleClick}
      className={`${className} flex justify-center cursor-pointer outline-hidden`}
    >
      <img
        alt="구글로고"
        src="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M17.75%2010.178C17.75%209.6512%2017.7064%209.12154%2017.6135%208.60326H10.1561V11.5876H14.4266C14.2494%2012.5501%2013.68%2013.4016%2012.8462%2013.9426V15.879H15.394C16.8901%2014.5292%2017.75%2012.5359%2017.75%2010.178Z'%20fill='%234285F4'/%3e%3cpath%20d='M10.1562%2017.75C12.2886%2017.75%2014.0868%2017.0637%2015.397%2015.8791L12.8492%2013.9427C12.1404%2014.4154%2011.2253%2014.6831%2010.1591%2014.6831C8.09651%2014.6831%206.34764%2013.319%205.72014%2011.4851H3.09103V13.4814C4.43318%2016.0984%207.16688%2017.75%2010.1562%2017.75Z'%20fill='%2334A853'/%3e%3cpath%20d='M5.71723%2011.4854C5.38605%2010.5229%205.38605%209.48067%205.71723%208.51816V6.52195H3.09102C1.96965%208.7118%201.96966%2011.2915%203.09103%2013.4814L5.71723%2011.4854Z'%20fill='%23FBBC05'/%3e%3cpath%20d='M10.1562%205.31745C11.2834%205.30037%2012.3728%205.71612%2013.1891%206.4793L15.4464%204.26667C14.0171%202.95105%2012.1201%202.22774%2010.1562%202.25052C7.16688%202.25052%204.43318%203.9021%203.09102%206.52195L5.71723%208.51816C6.34183%206.68142%208.09361%205.31745%2010.1562%205.31745Z'%20fill='%23EA4335'/%3e%3c/svg%3e"
      ></img>
      {value}
    </button>
  )
}

export default GoogleButton
