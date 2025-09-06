import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

interface SidebarItem {
    title: string;
    path: string;
    icon: JSX.Element;
    cName: string;
}

export const ClinicSidebarData: SidebarItem[] = [
  {
    title: 'Schedule',
    path: '/clinic/schedule',
    icon: <FaIcons.FaUser />,
    cName: 'nav-text'
  },
  {
    title: 'Edit Clinic Info',
    path: '/editClinicInfo',
    icon: <FaIcons.FaCalendarAlt />,
    cName: 'nav-text'
  },
  {
    title: 'Feedback',
    path: "/feedbacks/new", 
    icon: <FaIcons.FaEnvelopeOpenText />,
    cName: 'nav-text'
  },
  {
    title: 'Sign Out',
    path: "/signOut", 
    icon: <FaIcons.FaEnvelopeOpenText />,
    cName: 'nav-text'
  }
];
