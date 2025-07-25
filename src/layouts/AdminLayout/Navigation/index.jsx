import React, { useContext } from 'react';

import { ConfigContext } from '../../../contexts/ConfigContext';
import useWindowSize from '../../../hooks/useWindowSize';

import NavLogo from './NavLogo';
import NavContent from './NavContent';
import navigation from '../../../menu-items';

const Navigation = () => {
  const configContext = useContext(ConfigContext);
  const { collapseMenu } = configContext.state;
  const windowSize = useWindowSize();
  try {
    // const token = useSelector((state) => state.auth.token);
    // const filterMenuBasedOnPrivileges = (menuItems, privileges, role) => {
    //   const actionsMap = { 0: 'create', 1: 'read', 2: 'update', 3: 'delete' };
    //   return menuItems
    //     .map((child) => {
    //       const privilegeIndex = child.val ? privileges[parseInt(child.val) - 1] : null;
    //       if (privilegeIndex && privilegeIndex[1] === '0') return '';
    //       else if (privilegeIndex) {
    //         const privilegeBits = privilegeIndex.split('');

    //         child.children = child.children?.filter((subChild) => {
    //           const actionIndex = Object.keys(actionsMap).find((index) => {
    //             return actionsMap[index] === subChild.action;
    //           });
    //           return privilegeBits[actionIndex] === '1';
    //         });

    //         return child;
    //       } else {
    //         console.log(role);
    //         if (child.val === '5' && role !== 'admin') return;
    //         return child;
    //       }
    //     })
    //     .filter((child) => child);
    // };

    // if (token) {
    // const decoded = jwtDecode(token).data;
    // const data = JSON.parse(decoded.privileges);
    // const role = decoded.role;
    // navigation.items[0].children = filterMenuBasedOnPrivileges(navigation.items[0].children, Object.values(data), role);
    // }
  } catch (err) {
    console.log(err);
  }

  let navClass = ['pcoded-navbar'];

  navClass = [...navClass];

  if (windowSize.width < 992 && collapseMenu) {
    navClass = [...navClass, 'mob-open'];
  } else if (collapseMenu) {
    navClass = [...navClass, 'navbar-collapsed'];
  }

  let navBarClass = ['navbar-wrapper'];

  let navContent = (
    <div className={navBarClass.join(' ')}>
      <NavLogo />
      <NavContent navigation={navigation.items} />
    </div>
  );
  if (windowSize.width < 992) {
    navContent = (
      <div className="navbar-wrapper">
        <NavLogo />
        <NavContent navigation={navigation.items} />
      </div>
    );
  }
  return (
    <React.Fragment>
      <nav className={navClass.join(' ')}>{navContent}</nav>
    </React.Fragment>
  );
};

export default Navigation;
