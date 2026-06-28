import { WC_API, wcAuthHeaders } from '@/lib/wordpress/config';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return Response.json({ message: 'Invalid product ID.' }, { status: 400 });
  }

  const body = await request.json().catch(() => null) as {
    reviewer?: string;
    reviewer_email?: string;
    rating?: unknown;
    review?: string;
  } | null;

  if (!body) {
    return Response.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const { reviewer, reviewer_email, rating, review } = body;

  if (!reviewer?.trim() || !reviewer_email?.trim() || !review?.trim() || rating == null) {
    return Response.json({ message: 'All fields are required.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(reviewer_email)) {
    return Response.json({ message: 'Enter a valid email address.' }, { status: 400 });
  }
  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return Response.json({ message: 'Rating must be between 1 and 5.' }, { status: 400 });
  }
  if (review.trim().length < 10) {
    return Response.json({ message: 'Review must be at least 10 characters.' }, { status: 400 });
  }

  try {
    const res = await fetch(`${WC_API}/products/${productId}/reviews`, {
      method: 'POST',
      headers: { ...wcAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewer: reviewer.trim(),
        reviewer_email: reviewer_email.trim(),
        rating: ratingNum,
        review: review.trim(),
        status: 'approved',
      }),
    });

    if (!res.ok) {
      return Response.json(
        { message: 'Could not submit your review. Please try again.' },
        { status: 502 }
      );
    }

    return Response.json({ message: 'Review submitted.' }, { status: 201 });
  } catch {
    return Response.json(
      { message: 'Could not submit your review. Please try again.' },
      { status: 502 }
    );
  }
}
