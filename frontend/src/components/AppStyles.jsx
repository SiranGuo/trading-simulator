import React from 'react';

const AppStyles = () => (
    <style>
        {`
        
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
          }
          .app-container {
            width : 100%;
            min-height: 100vh;
            background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }

          .header {
            text-align: center;
            background-color: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            padding: 24px 0;
          }

          .header-content {
            max-width: 100%;
            margin: 0 auto;
            padding: 0 16px;
            dispaly: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
          }

          .header-left {
            display: flex;
            flex-direction: column;
          }

          .title {
            font-size: 32px;
            font-weight: bold;
            color: #111827;
            margin: 0;
          }

          .subtitle {
            color: #6b7280;
            margin: 4px 0 0 0;
            font-size: 16px;
          }

          .header-right {
            display: flex;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
          }

          .refresh-button {
            background-color: #2563eb;
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
          }

          .refresh-button:hover {
            background-color: #1d4ed8;
          }

          .refresh-button:disabled {
            opacity: 0.5;
            pointer-events: none;
          }

          .update-time {
            font-size: 14px;
            color: #6b7280;
          }

          .main {
            max-width: 1280px;
            margin: 0 auto;
            padding: 32px 16px;
          }

          .error-alert {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            color: #b91c1c;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
          }

          .error-icon {
            margin-right: 8px;
          }

          .stock-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            margin-bottom: 48px;
          }

          .stock-card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            padding: 24px;
            border-left: 4px solid;
            transition: box-shadow 0.2s;
            cursor: pointer;
          }

          .stock-card:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }

          .stock-card-positive {
            border-left-color: #10b981;
          }

          .stock-card-negative {
            border-left-color: #ef4444;
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
          }

          .symbol {
            font-size: 24px;
            font-weight: bold;
            color: #111827;
            margin: 0 0 8px 0;
          }

          .demo-tag {
            font-size: 12px;
            background-color: #fef3c7;
            color: #92400e;
            padding: 2px 8px;
            border-radius: 9999px;
          }

          .price-container {
            text-align: right;
          }

          .price {
            font-size: 28px;
            font-weight: bold;
            color: #111827;
          }

          .change-container {
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 12px;
          }

          .change-container-positive {
            background-color: #f0fdf4;
          }

          .change-container-negative {
            background-color: #fef2f2;
          }

          .change-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .change-text {
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .change-text-positive {
            color: #059669;
          }

          .change-text-negative {
            color: #dc2626;
          }

          .change-amount {
            margin-left: 4px;
          }

          .change-percent {
            font-weight: 600;
          }

          .change-percent-positive {
            color: #059669;
          }

          .change-percent-negative {
            color: #dc2626;
          }

          .last-updated {
            font-size: 14px;
            color: #6b7280;
          }

          .footer {
            text-align: center;
          }

          .footer-card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            padding: 16px;
            display: inline-block;
          }

          .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
          }

          .footer-subtext {
            font-size: 14px;
            color: #6b7280;
            margin: 4px 0 0 0;
          }

          /* Skeleton styles */
          .skeleton-card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            padding: 24px;
            border-left: 4px solid #e5e7eb;
          }

          .skeleton-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
          }

          .skeleton-symbol {
            height: 24px;
            background-color: #d1d5db;
            border-radius: 4px;
            width: 64px;
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          .skeleton-price {
            height: 32px;
            background-color: #d1d5db;
            border-radius: 4px;
            width: 80px;
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          .skeleton-content {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .skeleton-line {
            height: 16px;
            background-color: #e5e7eb;
            border-radius: 4px;
            width: 100%;
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          .skeleton-line-short {
            height: 16px;
            background-color: #e5e7eb;
            border-radius: 4px;
            width: 75%;
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .header-content {
              flex-direction: column;
              text-align: center;
            }
            
            .title {
              font-size: 24px;
            }
            
            .stock-grid {
              grid-template-columns: 1fr;
            }
          }
      `}
    </style>
);

export default AppStyles;