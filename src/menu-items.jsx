const menuItems = {
  items: [
    {
      id: 'Dashboard',
      title: 'Dashboard',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-pie-chart',
          url: '/app/dashboard/reports'
        },
        {
          id: 'users',
          title: 'Admins',
          type: 'collapse',
          icon: 'feather icon-slack',
          children: [
            {
              id: 'users',
              title: 'Users',
              type: 'item',
              icon: 'feather icon-users',
              url: '/app/dashboard/admin/users'
            },
            {
              id: 'add-user',
              title: 'Add user',
              type: 'item',
              icon: 'feather icon-user-plus',
              url: '/app/dashboard/admin/add-user'
            }
          ]
        },
        {
          id: 'authors',
          title: 'Authors',
          type: 'collapse',
          icon: 'feather icon-mic',
          children: [
            {
              id: 'authors-list',
              title: 'Author List',
              type: 'item',
              icon: 'feather icon-users',
              url: '/app/dashboard/authors/authors-list'
            },
            {
              id: 'add-author',
              title: 'Add Author',
              type: 'item',
              icon: 'feather icon-plus-circle',
              url: '/app/dashboard/authors/add-author'
            }
          ]
        },
        {
          id: 'explanations',
          title: 'Explanations',
          type: 'collapse',
          icon: 'feather icon-zap',
          url: '/app/dashboard/explanations/explanations-list',
          children: [
            {
              id: 'explanations-list',
              title: 'Explanations List',
              type: 'item',
              icon: 'feather icon-pocket',
              url: '/app/dashboard/explanations/explanations-list'
            },
            {
              id: 'add-explanations',
              title: 'Add Explanation',
              type: 'item',
              icon: 'feather icon-plus-circle',
              url: '/app/dashboard/explanations/add-explanation'
            }
          ]
        },
        {
          id: 'reports-list',
          title: 'User Reports',
          type: 'item',
          icon: 'feather icon-alert-triangle',
          url: '/app/dashboard/reports/reports-list'
        },
        {
          id: 'videos',
          title: 'All Videos',
          type: 'collapse',
          icon: 'feather icon-video',
          children: [
            { id: 'videos-list', title: 'Videos', type: 'item', icon: 'feather icon-video', url: '/app/dashboard/videos/videos-list' },
            {
              id: 'create-video',
              title: 'Create Videos',
              type: 'item',
              icon: 'feather icon-plus-circle',
              url: '/app/dashboard/videos/create-video'
            }
          ]
        },
        {
          id: 'profile',
          title: 'Profile',
          type: 'item',
          icon: 'feather icon-user',
          url: '/app/dashboard/profile/edit-profile'
        }
      ]
    }
  ]
};

export default menuItems;
