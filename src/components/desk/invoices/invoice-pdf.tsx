import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Invoice } from "./types";
import { lineTotal, money, totals } from "./types";

// The printed invoice, in bureau livery. Standard PDF faces (Times, Courier)
// keep the file small and need no font downloads.

const ink = "#2c2216";
const soft = "#5c4a31";
const faint = "#8b7754";
const rule = "#c9b48c";

const s = StyleSheet.create({
  page: { padding: 44, backgroundColor: "#f7f1e3", color: ink, fontFamily: "Times-Roman", fontSize: 10.5 },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: ink, paddingBottom: 12 },
  title: { fontFamily: "Times-Bold", fontSize: 26, letterSpacing: 1 },
  kicker: { fontFamily: "Courier", fontSize: 7.5, letterSpacing: 2, color: soft, marginBottom: 4 },
  meta: { textAlign: "right", fontFamily: "Courier", fontSize: 9, color: soft, lineHeight: 1.5 },
  seal: { width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: "#923719", alignItems: "center", justifyContent: "center", marginBottom: 6 },
  sealText: { fontFamily: "Courier-Bold", fontSize: 7, color: "#923719", letterSpacing: 1 },
  parties: { flexDirection: "row", marginTop: 18, gap: 24 },
  party: { flex: 1 },
  label: { fontFamily: "Courier", fontSize: 7.5, letterSpacing: 2, color: faint, marginBottom: 4 },
  strong: { fontFamily: "Times-Bold", fontSize: 12 },
  line: { color: soft, lineHeight: 1.4 },
  table: { marginTop: 22 },
  th: { flexDirection: "row", backgroundColor: ink, color: "#f7f1e3", paddingVertical: 6, paddingHorizontal: 8, fontFamily: "Times-Bold" },
  tr: { flexDirection: "row", paddingVertical: 7, paddingHorizontal: 8, borderBottomWidth: 0.6, borderBottomColor: rule },
  cDesc: { flex: 1 },
  cNum: { width: 70, textAlign: "right" },
  sums: { marginTop: 14, marginLeft: "auto", width: 220 },
  sumRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  total: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1.5, borderTopColor: ink, marginTop: 6, paddingTop: 6, fontFamily: "Times-Bold", fontSize: 13 },
  foot: { flexDirection: "row", marginTop: 28, gap: 24 },
  note: { flex: 1, color: soft, lineHeight: 1.45 },
  sign: { width: 180, alignItems: "flex-end" },
  signName: { fontFamily: "Times-Italic", fontSize: 20, color: ink },
  signRule: { borderTopWidth: 0.8, borderTopColor: ink, width: 160, marginTop: 2 },
  bottom: { position: "absolute", bottom: 28, left: 44, right: 44, textAlign: "center", fontFamily: "Courier", fontSize: 7, color: faint, letterSpacing: 1.5 },
});

export function InvoicePdf({ inv }: { inv: Invoice }) {
  const t = totals(inv);
  const items = inv.items.filter((i) => i.desc.trim() || i.qty || i.rate);
  return (
    <Document title={`Invoice ${inv.number}`} author={inv.from.name} creator="The Developer Times · Casefile Invoices">
      <Page size="A4" style={s.page}>
        <View style={s.head}>
          <View>
            <Text style={s.kicker}>INVESTIGATION BUREAU · CASEFILE INVOICE</Text>
            <Text style={s.title}>INVOICE</Text>
            <Text style={{ marginTop: 4, fontFamily: "Times-Italic", color: soft }}>For services rendered and mysteries resolved</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            {inv.logo ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={inv.logo} style={{ width: 70, height: 54, objectFit: "contain", marginBottom: 6 }} />
            ) : (
              <View style={s.seal}>
                <Text style={s.sealText}>BUREAU</Text>
                <Text style={s.sealText}>SEAL</Text>
              </View>
            )}
            <Text style={s.meta}>No. {inv.number || "—"}</Text>
            <Text style={s.meta}>Issued {inv.issueDate || "—"}</Text>
            {inv.dueDate ? <Text style={s.meta}>Due {inv.dueDate}</Text> : null}
          </View>
        </View>

        <View style={s.parties}>
          {[
            ["BILL FROM", inv.from],
            ["BILL TO", inv.to],
          ].map(([label, p]) => {
            const party = p as Invoice["from"];
            return (
              <View key={label as string} style={s.party}>
                <Text style={s.label}>{label as string}</Text>
                <Text style={s.strong}>{party.name || "—"}</Text>
                {[party.company, party.email, party.website, party.address].filter(Boolean).map((l, i) => (
                  <Text key={i} style={s.line}>
                    {l}
                  </Text>
                ))}
              </View>
            );
          })}
        </View>

        <View style={s.table}>
          <View style={s.th}>
            <Text style={s.cDesc}>Scope of Investigation</Text>
            <Text style={s.cNum}>Qty</Text>
            <Text style={s.cNum}>Rate</Text>
            <Text style={s.cNum}>Total</Text>
          </View>
          {items.map((i, k) => (
            <View key={k} style={s.tr} wrap={false}>
              <Text style={s.cDesc}>{i.desc || "—"}</Text>
              <Text style={s.cNum}>{i.qty}</Text>
              <Text style={s.cNum}>{money(i.rate, inv.currency)}</Text>
              <Text style={s.cNum}>{money(lineTotal(i), inv.currency)}</Text>
            </View>
          ))}
        </View>

        <View style={s.sums}>
          <View style={s.sumRow}>
            <Text>Subtotal</Text>
            <Text>{money(t.subtotal, inv.currency)}</Text>
          </View>
          {inv.taxPct ? (
            <View style={s.sumRow}>
              <Text>Tax ({inv.taxPct}%)</Text>
              <Text>{money(t.tax, inv.currency)}</Text>
            </View>
          ) : null}
          {inv.discountPct ? (
            <View style={s.sumRow}>
              <Text>Discount ({inv.discountPct}%)</Text>
              <Text>−{money(t.discount, inv.currency)}</Text>
            </View>
          ) : null}
          <View style={s.total}>
            <Text>Total</Text>
            <Text>
              {inv.currency} {money(t.total, inv.currency)}
            </Text>
          </View>
        </View>

        <View style={s.foot}>
          <View style={s.note}>
            {inv.notes ? (
              <>
                <Text style={s.label}>NOTES TO CLIENT</Text>
                <Text>{inv.notes}</Text>
              </>
            ) : null}
            {inv.terms ? <Text style={{ marginTop: 8, fontFamily: "Times-Italic" }}>{inv.terms}</Text> : null}
            {inv.remittance ? (
              <>
                <Text style={[s.label, { marginTop: 12 }]}>REMITTANCE DETAILS</Text>
                <Text style={{ fontFamily: "Courier", fontSize: 9 }}>{inv.remittance}</Text>
              </>
            ) : null}
          </View>
          <View style={s.sign}>
            <Text style={s.signName}>{inv.signature || inv.from.name}</Text>
            <View style={s.signRule} />
            <Text style={[s.label, { marginTop: 4 }]}>AUTHORISED SIGNATURE</Text>
          </View>
        </View>

        <Text style={s.bottom} fixed>
          INTERNAL USE · CASEFILE INVOICES · GENERATED VIA THE DEVELOPER TIMES DESK APPARATUS
        </Text>
      </Page>
    </Document>
  );
}
