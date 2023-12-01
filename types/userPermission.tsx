export const PermissionNode = [
  {
    value: "GLOBAL",
    label: "Global Permissions",
    children: [
      {
        value: "All",
        label: "All Admin Permissions",
        children: [
          {
            value: "VEIW_ALL",
            label: "View Permissions",
            children: [
              {
                value: "VIEW_ACL",
                label: "View ACL",
                id: "view-acl"
              },
              {
                value: "VIEW_ADMIN_ACL",
                label: "View Admin ACL"
              },
              {
                value: "VIEW_BRIDGE",
                label: "View Bridge"
              },
              {
                value: "VIEW_CONNECTION",
                label: "View Connection"
              },
              {
                value: "VIEW_DESTINATION",
                label: "View Destination"
              },
              {
                value: "VIEW_DURABLE",
                label: "View Durable"
              },
              {
                value: "VIEW_FACTORY",
                label: "View Factory"
              },
              {
                value: "VIEW_GROUP",
                label: "View Group"
              },
              {
                value: "VIEW_MESSAGE",
                label: "View Message"
              },
              {
                value: "VIEW_ROUTE",
                label: "View Rouote"
              },
              {
                value: "VIEW_SERVER",
                label: "View Server"
              },
              {
                value: "VIEW_USER",
                label: "View User"
              },
            ]
          },
          {
            value: "MODIFY",
            label: "Modify Permissions",
            children: [
              {
                value: "CHANGE_ACL",
                label: "Change ACL"
              },
              {
                value: "CHANGE_ADMIN_ACL",
                label: "Change Admin ACL"
              },
              {
                value: "CHANGE_BRIDGE",
                label: "Change Bridge"
              },
              {
                value: "CHANGE_CONNECTION",
                label: "Change Connection"
              },
              {
                value: "CHANGE_DURABLE",
                label: "Change Durable"
              },
              {
                value: "CHANGE_FACTORY",
                label: "Change Factory"
              },
              {
                value: "CHANGE_GROUP",
                label: "Change Group"
              },
              {
                value: "CHANGE_MESSAGE",
                label: "Change Message"
              },
              {
                value: "CHANGE_ROUTE",
                label: "Change Route"
              },
              {
                value: "CHANGE_SERVER",
                label: "Change Server"
              },
              {
                value: "CHANGE_USER",
                label: "Change User"
              },
              {
                value: "CREATE_DESTINATION",
                label: "Create Destination"
              },
              {
                value: "DELETE_DESTINATION",
                label: "Delete Destination"
              },
              {
                value: "MODIFY_DESTINATION",
                label: "Modify Destination"
              }
            ]
          },
          {
            value: "PURGE",
            label: "Purge Permissions",
            children: [
              {
                value: "PURGE_DESTINATION",
                label: "Purge Destination"
              },
              {
                value: "PURGE_DURABLE",
                label: "Purge Durable"
              }
            ]
          },
          {
            value: "SHUTDOWN_PER",
            label: "Shutdown Permissions",
            children: [
              {
                value: "SHUTDOWN_SERVER",
                label: "Shutdown Server"
              },
            ]
          }
        ]
      },
      {
        value: "PROTECT",
        label: "Protect Permissions",
        children: [
          {
            value: "PROTECT1",
            label: "Protect1"
          },
          {
            value: "PROTECT2",
            label: "Protect2"
          },
          {
            value: "PROTECT3",
            label: "Protect3"
          },
          {
            value: "PROTECT4",
            label: "Protect4"
          }
        ]
      }
    ]
  }
];

export const PermissionCheck = [
  {
    value: "VIEW_ACL",
    label: "View ACL"
  },
  {
    value: "VIEW_ADMIN_ACL",
    label: "View Admin ACL"
  },
  {
    value: "VIEW_BRIDGE",
    label: "View Bridge"
  },
  {
    value: "VIEW_CONNECTION",
    label: "View Connection"
  },
  {
    value: "VIEW_DESTINATION",
    label: "View Destination"
  },
  {
    value: "VIEW_DURABLE",
    label: "View Durable"
  },
  {
    value: "VIEW_FACTORY",
    label: "View Factory"
  },
  {
    value: "VIEW_GROUP",
    label: "View Group"
  },
  {
    value: "VIEW_MESSAGE",
    label: "View Message"
  },
  {
    value: "VIEW_ROUTE",
    label: "View Rouote"
  },
  {
    value: "VIEW_SERVER",
    label: "View Server"
  },
  {
    value: "VIEW_USER",
    label: "View User"
  },
  {
    value: "CHANGE_ACL",
    label: "Change ACL"
  },
  {
    value: "CHANGE_ADMIN_ACL",
    label: "Change Admin ACL"
  },
  {
    value: "CHANGE_BRIDGE",
    label: "Change Bridge"
  },
  {
    value: "CHANGE_CONNECTION",
    label: "Change Connection"
  },
  {
    value: "CHANGE_DURABLE",
    label: "Change Durable"
  },
  {
    value: "CHANGE_FACTORY",
    label: "Change Factory"
  },
  {
    value: "CHANGE_GROUP",
    label: "Change Group"
  },
  {
    value: "CHANGE_MESSAGE",
    label: "Change Message"
  },
  {
    value: "CHANGE_ROUTE",
    label: "Change Route"
  },
  {
    value: "CHANGE_SERVER",
    label: "Change Server"
  },
  {
    value: "CHANGE_USER",
    label: "Change User"
  },
  {
    value: "CREATE_DESTINATION",
    label: "Create Destination"
  },
  {
    value: "DELETE_DESTINATION",
    label: "Delete Destination"
  },
  {
    value: "MODIFY_DESTINATION",
    label: "Modify Destination"
  },
  {
    value: "PURGE_DESTINATION",
    label: "Purge Destination"
  },
  {
    value: "PURGE_DURABLE",
    label: "Purge Durable"
  },
  {
    value: "SHUTDOWN_SERVER",
    label: "Shutdown Server"
  }
];

export const PermissionView = [
  {
    value: "VIEW_ACL",
    label: "View ACL"
  },
  {
    value: "VIEW_ADMIN_ACL",
    label: "View Admin ACL"
  },
  {
    value: "VIEW_BRIDGE",
    label: "View Bridge"
  },
  {
    value: "VIEW_CONNECTION",
    label: "View Connection"
  },
  {
    value: "VIEW_DESTINATION",
    label: "View Destination"
  },
  {
    value: "VIEW_DURABLE",
    label: "View Durable"
  },
  {
    value: "VIEW_FACTORY",
    label: "View Factory"
  },
  {
    value: "VIEW_GROUP",
    label: "View Group"
  },
  {
    value: "VIEW_MESSAGE",
    label: "View Message"
  },
  {
    value: "VIEW_ROUTE",
    label: "View Rouote"
  },
  {
    value: "VIEW_SERVER",
    label: "View Server"
  },
  {
    value: "VIEW_USER",
    label: "View User"
  }
];