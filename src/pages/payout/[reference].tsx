import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import '@/styles/global.css';
import '../dashboard/main.css';

const SideNavbar = dynamic(() => import('@/components/sideNavbar/side-navbar'), { ssr: false });
const TopNavbar = dynamic(() => import('@/components/top-navbar'), { ssr: false });

type BreakupRow = {
  reconcileDate: string;
  invoiceNumber: string;
  description: string;
  amount: string;
};

const dummy = {
  testMode: true,
  payoutId: 'payout_f0A_1760346000889_oDgkv_000',
  partner: 'abcd',
  purpose: 'P0102 - Realisation of export bills (in respect of goods) sent on …',
  currency: 'INR',
  totalAmount: '965.70',
  summary: {
    gross: { label: 'Total Gross Amount', value: 'USD 20.00' },
    fees: { label: 'Payout Fees', value: 'USD 9.00' },
    netPayout: { label: 'Net Payout', value: 'USD 11.00' },
    fx: { label: 'Exch. Rate (USD 1.00)', value: 'INR 87.79057' },
    final: { label: 'Final Settled Amount', value: 'INR 965.70' },
  },
  bankDetails: {
    bankInfo: 'citi Prefilled Name - XXXX0101',
    descriptor: '17603460039PVF01',
    utr: 'TESTUTR6021856361',
  },
  documents: [{ name: 'Payment Advice from JPMC', url: '#' }],
  breakup: {
    rows: [{ reconcileDate: 'Oct 13', invoiceNumber: '11222', description: 'hello', amount: 'USD 20.00' }] as BreakupRow[],
    totals: { gross: 'USD 20.00', fees: '- USD 9.00', net: 'USD 11.00' },
  },
};

const cardStyle: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 };
const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#334155', borderBottom: '1px solid #e5e7eb' };
const td: React.CSSProperties = { padding: '10px 12px', fontSize: 13, borderBottom: '1px solid #f1f5f9' };
const totalRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', fontSize: 13 };

const PayoutDetailsPage: React.FC = () => {
  const router = useRouter();
  const { reference } = router.query as { reference?: string };
  const title = useMemo(() => `Payout Reference: ${reference ?? ''}`.trim(), [reference]);

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <SideNavbar />
      <div className="content" style={{ flexGrow: 1, height: '100%', overflow: 'auto', background: 'var(--bg-clr-2)' }}>
        <TopNavbar />
        <div className="dashboard-content" style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <button onClick={() => router.back()} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>←</button>
        <div style={{ fontWeight: 600 }}>{title}</div>
        {dummy.testMode && (
          <span style={{ marginLeft: 8, background: '#eef2ff', color: '#4f46e5', borderRadius: 12, fontSize: 12, padding: '2px 8px' }}>Test Mode</span>
        )}
        <div style={{ marginLeft: 'auto', fontSize: 12, color: '#6b7280' }}>Payout ID: {dummy.payoutId}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
            Partner: <a style={{ color: '#2563eb', textDecoration: 'none' }} href="#">{dummy.partner}</a> | Payout for Purpose Code: {dummy.purpose}
          </div>
          <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 8 }}>
            {dummy.currency} {dummy.totalAmount}
          </div>
          <div style={{ height: 1, background: '#e5e7eb', margin: '8px 0' }} />
          {[dummy.summary.gross, dummy.summary.fees, dummy.summary.netPayout, dummy.summary.fx].map((row, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
              <span style={{ color: '#334155', fontSize: 13 }}>{row.label}</span>
              <span style={{ fontSize: 13 }}>{row.value}</span>
            </div>
          ))}
          <div style={{ height: 1, background: '#e5e7eb', margin: '8px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontWeight: 600 }}>
            <span>{dummy.summary.final.label}</span>
            <span>{dummy.summary.final.value}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={cardStyle}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Bank Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', rowGap: 6 }}>
              <div style={{ color: '#6b7280' }}>Bank Info</div><div>{dummy.bankDetails.bankInfo}</div>
              <div style={{ color: '#6b7280' }}>Statement Descriptor</div><div>{dummy.bankDetails.descriptor}</div>
              <div style={{ color: '#6b7280' }}>UTR</div><div>{dummy.bankDetails.utr}</div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 600 }}>Compliance Documents</div>
              <a href={dummy.documents[0].url} style={{ color: '#2563eb', textDecoration: 'none', fontSize: 14 }}>Download</a>
            </div>
            <div style={{ marginTop: 8, fontSize: 13 }}>Payment Advice from JPMC</div>
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Payout Break-up By Receivables</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={th}>Reconcile Date</th>
                <th style={th}>Invoice Number</th>
                <th style={th}>Invoice Description</th>
                <th style={{ ...th, textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {dummy.breakup.rows.map((r, i) => (
                <tr key={i}>
                  <td style={td}>{r.reconcileDate}</td>
                  <td style={td}><a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>{r.invoiceNumber}</a></td>
                  <td style={td}>{r.description}</td>
                  <td style={{ ...td, textAlign: 'right' }}>{r.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', marginTop: 12, gap: 8 }}>
          <div />
          <div style={{ width: 240 }}>
            <div style={totalRow}><span>Gross Payout</span><span>{dummy.breakup.totals.gross}</span></div>
            <div style={totalRow}><span>Payout Fees</span><span>{dummy.breakup.totals.fees}</span></div>
            <div style={{ height: 1, background: '#e5e7eb', margin: '8px 0' }} />
            <div style={{ ...totalRow, fontWeight: 700 }}><span>Net Payout</span><span>{dummy.breakup.totals.net}</span></div>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutDetailsPage;