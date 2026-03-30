import { NextRequest, NextResponse } from "next/server";

const STANCER_SECRET_KEY = process.env.STANCER_SECRET_KEY || "";
const STANCER_PUBLIC_KEY = process.env.STANCER_PUBLIC_KEY || "";

export async function POST(request: NextRequest) {
  try {
    if (!STANCER_SECRET_KEY) {
      return NextResponse.json(
        { error: "Configuration de paiement manquante." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { amount, currency, description, customer } = body;

    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: "Le montant minimum est de 0,50 €." },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") || "https://www.fain-avocats.fr";

    const paymentData: Record<string, unknown> = {
      amount,
      currency: currency || "eur",
      description: description || "Acompte honoraires - Fain Avocats",
      return_url: `${origin}/paiement?status=done`,
      capture: true,
    };

    if (customer) {
      paymentData.customer = {
        ...(customer.name && { name: customer.name }),
        ...(customer.email && { email: customer.email }),
      };
    }

    const auth = Buffer.from(`${STANCER_SECRET_KEY}:`).toString("base64");

    const response = await fetch("https://api.stancer.com/v1/checkout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Stancer API error:", data);
      return NextResponse.json(
        { error: "Erreur lors de la création du paiement. Veuillez réessayer." },
        { status: response.status }
      );
    }

    const paymentId = data.id;

    if (data.payment_page_url) {
      return NextResponse.json({ redirect_url: data.payment_page_url });
    }

    if (STANCER_PUBLIC_KEY && paymentId) {
      const redirectUrl = `https://payment.stancer.com/${STANCER_PUBLIC_KEY}/${paymentId}?lang=fr`;
      return NextResponse.json({ redirect_url: redirectUrl });
    }

    return NextResponse.json(
      { error: "Impossible de générer le lien de paiement." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Payment route error:", error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
