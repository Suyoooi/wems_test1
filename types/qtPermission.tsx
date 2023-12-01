export const QueuePermNode = [
  {
    value: "All",
    label: "All Permissions",
    children: [
      {
        value: "JMS_ALL",
        label: "JMS Permissions",
        children: [
          {
            value: "SEND",
            label: "Send To Queue"
          },
          {
            value: "RECEIVE",
            label: "Receive From Queue"
          },
          {
            value: "BROWSE",
            label: "Browse Queue"
          }
        ]
      },
      {
        value: "ADMIN",
        label: "Admin Permissions",
        children: [
          {
            value: "VIEW",
            label: "View Queue"
          },
          {
            value: "CREATE",
            label: "Create Queue"
          },
          {
            value: "MODIFY",
            label: "Modify Queue"
          },
          {
            value: "DELETE",
            label: "Delete Queue"
          },
          {
            value: "PURGE",
            label: "Purge Queue"
          }
        ]
      }
    ]
  }
];

export const TopicPermNode = [
  {
    value: "All",
    label: "All Permissions",
    children: [
      {
        value: "JMS_ALL",
        label: "JMS Permissions",
        children: [
          {
            value: "SUBSCRIBE",
            label: "Subscribe To Topic"
          },
          {
            value: "PUBLISH",
            label: "Publish To Topic"
          },
          {
            value: "DURABLE",
            label: "Create Durable"
          },
          {
            value: "USE_DURABLE",
            label: "Use Durable"
          }
        ]
      },
      {
        value: "ADMIN",
        label: "Admin Permissions",
        children: [
          {
            value: "VIEW",
            label: "View Queue"
          },
          {
            value: "CREATE",
            label: "Create Queue"
          },
          {
            value: "MODIFY",
            label: "Modify Queue"
          },
          {
            value: "DELETE",
            label: "Delete Queue"
          },
          {
            value: "PURGE",
            label: "Purge Queue"
          }
        ]
      }
    ]
  }
];