
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, User, Bot, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  text: string;
}

interface QuestionOption {
  id: string;
  questionText: string;
  answerText: string;
  followUpQuestionIds?: string[];
  isFollowUp?: boolean; // To know if we need a "back" button
}

const allQuestions: Record<string, QuestionOption> = {
  // Initial Questions
  q_what_is_dormnexus: {
    id: 'q_what_is_dormnexus',
    questionText: 'What is DormNexus?',
    answerText: 'DormNexus is a comprehensive hostel management system designed to streamline operations for administrators and enhance the living experience for students. It covers registration, attendance, billing, complaints, and more.',
  },
  q_how_to_register: {
    id: 'q_how_to_register',
    questionText: 'How do I register?',
    answerText: 'Go to the Register page from the homepage. You\'ll need to fill in your personal details, contact information, address, and Aadhaar number. Make sure all information is accurate.',
    followUpQuestionIds: ['q_aadhaar_mandatory', 'q_parents_register', 'q_documents_needed'],
  },
  q_how_to_login: {
    id: 'q_how_to_login',
    questionText: 'How do I log in?',
    answerText: 'Click the "Login" button on the homepage. Students log in with their registered email and password. Administrators have a separate login link usually found in the footer or a specific admin URL.',
  },
  q_facilities: {
    id: 'q_facilities',
    questionText: 'What facilities are available?',
    answerText: 'We offer a range of facilities including high-speed Wi-Fi, laundry service, a study room, 24/7 security, a gymnasium, and a common room with TV.',
    followUpQuestionIds: ['q_wifi_details', 'q_laundry_cost', 'q_gym_timings'],
  },
  q_mess_timings: {
    id: 'q_mess_timings',
    questionText: 'What are the mess timings?',
    answerText: 'Mess timings are typically: Breakfast: 8:00 AM – 9:00 AM, Lunch: 1:00 PM – 2:00 PM, Dinner: 7:00 PM – 8:00 PM. Please check the notice board for any changes.',
  },
  q_hostel_rules: {
    id: 'q_hostel_rules',
    questionText: 'What are the hostel rules?',
    answerText: 'Key hostel rules include maintaining cleanliness, adhering to gate timings, no substance abuse, and respecting quiet hours. A detailed rulebook is available in your student handbook or on the dashboard.',
    followUpQuestionIds: ['q_guest_policy', 'q_gate_timings_details'],
  },
  q_report_issue: {
    id: 'q_report_issue',
    questionText: 'How can I report an issue or complaint?',
    answerText: 'Students can log in to their dashboard and use the "Lodge a Complaint" section. For urgent issues, contact the hostel warden directly.',
  },
  q_contact_support: {
    id: 'q_contact_support',
    questionText: 'Who do I contact for support?',
    answerText: 'For technical issues with the portal, email support@dormnexus.example.com. For hostel-specific issues, contact your warden or the administration office.',
  },

  // Follow-up Questions for Registration
  q_aadhaar_mandatory: {
    id: 'q_aadhaar_mandatory',
    questionText: 'Is Aadhaar mandatory for registration?',
    answerText: 'Yes, Aadhaar is required for identity verification during the registration process.',
    isFollowUp: true,
  },
  q_parents_register: {
    id: 'q_parents_register',
    questionText: 'Can parents register on behalf of students?',
    answerText: 'No, students need to register themselves as the account is specific to them for attendance, billing, and other services.',
    isFollowUp: true,
  },
  q_documents_needed: {
    id: 'q_documents_needed',
    questionText: 'What documents are needed for registration?',
    answerText: 'Primarily your Aadhaar card for online registration. You might need to submit physical copies of other documents like admission proof or photos to the hostel office later.',
    isFollowUp: true,
  },

  // Follow-up Questions for Facilities
  q_wifi_details: {
    id: 'q_wifi_details',
    questionText: 'Tell me more about Wi-Fi.',
    answerText: 'High-speed Wi-Fi is available throughout the hostel premises. Login credentials are provided upon check-in.',
    isFollowUp: true,
  },
  q_laundry_cost: {
    id: 'q_laundry_cost',
    questionText: 'Is laundry free or paid?',
    answerText: 'Laundry services are typically available at a nominal charge per load or via a subscription. Check with the hostel office for current rates.',
    isFollowUp: true,
  },
  q_gym_timings: {
    id: 'q_gym_timings',
    questionText: 'What are the gym timings?',
    answerText: 'The gymnasium is usually open from 6:00 AM to 9:00 AM and 5:00 PM to 8:00 PM. Timings may vary, so please check the gym notice board.',
    isFollowUp: true,
  },

  // Follow-up Questions for Rules
  q_guest_policy: {
    id: 'q_guest_policy',
    questionText: 'Are guests allowed in the hostel?',
    answerText: 'Guest policies vary. Generally, guests may be allowed in common areas for limited periods with prior permission. Overnight guests are usually not permitted in rooms. Please refer to the detailed rulebook.',
    isFollowUp: true,
  },
  q_gate_timings_details: {
    id: 'q_gate_timings_details',
    questionText: 'What are the specific gate closing times?',
    answerText: 'Hostel gates typically close by 10:00 PM for students. Late entry requires prior permission from the warden. These timings are strictly enforced for security.',
    isFollowUp: true,
  },
  
  // More General Questions
  q_room_allocation: {
    id: 'q_room_allocation',
    questionText: 'How is room allocation done?',
    answerText: 'Room allocation is generally based on availability and policies like year of study or specific program needs. Sometimes it is first-come-first-served or based on a lottery system.',
  },
  q_change_room: {
    id: 'q_change_room',
    questionText: 'Can I change my room after allocation?',
    answerText: 'Room change requests are considered under special circumstances and subject to availability. You would need to apply to the hostel administration with a valid reason.',
  },
  q_fee_payment: {
    id: 'q_fee_payment',
    questionText: 'What is the fee payment process?',
    answerText: 'Hostel fees can usually be paid online through the student dashboard or via bank transfer. Deadlines and payment methods are communicated at the beginning of each semester/year.',
  },
  q_late_fee: {
    id: 'q_late_fee',
    questionText: 'Are there late fees for payment?',
    answerText: 'Yes, late payment of fees usually incurs a fine. Please adhere to payment deadlines to avoid penalties.',
  }
};

const initialQuestionIds = [
  'q_what_is_dormnexus',
  'q_how_to_register',
  'q_how_to_login',
  'q_facilities',
  'q_mess_timings',
  'q_hostel_rules',
  'q_report_issue',
];

export function StaticChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [currentQuestionIds, setCurrentQuestionIds] = useState<string[]>(initialQuestionIds);
  const [historyStack, setHistoryStack] = useState<string[][]>([initialQuestionIds]); // For "Go Back"

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatLog]);

  const handleQuestionClick = (questionId: string) => {
    const question = allQuestions[questionId];
    if (!question) return;

    const newChatLog: ChatMessage[] = [
      ...chatLog,
      { id: Date.now().toString() + '_q', type: 'user', text: question.questionText },
      { id: Date.now().toString() + '_a', type: 'bot', text: question.answerText },
    ];
    setChatLog(newChatLog);

    if (question.followUpQuestionIds && question.followUpQuestionIds.length > 0) {
      setHistoryStack([...historyStack, question.followUpQuestionIds]);
      setCurrentQuestionIds(question.followUpQuestionIds);
    } else {
      // If no follow-ups, decide what to show next. For now, back to initial or stay.
      // To keep it simple, if no follow-ups, we just show the "Go Back" or initial option if already at root.
      // If it's a follow-up question itself with no further follow-ups, clicking it implies we might want to go back.
      if (question.isFollowUp) {
        // No explicit new questions, implies a leaf node. User might click "Go Back"
        setCurrentQuestionIds([]); // Clear current specific questions, only "Go Back" will be available
      } else {
         // It was an initial question with no follow-ups, go back to initial questions
        setHistoryStack([initialQuestionIds]);
        setCurrentQuestionIds(initialQuestionIds);
      }
    }
  };

  const handleGoBack = () => {
    if (historyStack.length > 1) {
      const newHistoryStack = historyStack.slice(0, -1);
      setHistoryStack(newHistoryStack);
      setCurrentQuestionIds(newHistoryStack[newHistoryStack.length - 1]);
    }
  };
  
  const currentDisplayQuestions = currentQuestionIds.map(id => allQuestions[id]).filter(Boolean);
  const canGoBack = historyStack.length > 1;

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg z-50"
        onClick={() => setIsOpen(true)}
        aria-label="Open chatbot"
      >
        <MessageCircle size={28} />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 sm:w-96 h-[500px] shadow-xl z-50 flex flex-col rounded-lg border bg-card">
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <CardTitle className="text-lg">Hostel Helper</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close chatbot">
          <X size={20} />
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-3 space-y-3">
          {chatLog.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'p-2.5 rounded-lg max-w-[85%]',
                msg.type === 'user' ? 'bg-primary text-primary-foreground ml-auto rounded-br-none' : 'bg-muted text-muted-foreground rounded-bl-none'
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          ))}
        </ScrollArea>
        <div className="p-3 border-t">
          <div className="space-y-2">
            {currentDisplayQuestions.map((q) => (
              <Button
                key={q.id}
                variant="outline"
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => handleQuestionClick(q.id)}
              >
                {q.questionText}
              </Button>
            ))}
            {canGoBack && (
               <Button
                variant="ghost"
                className="w-full justify-start text-left h-auto py-2 text-primary hover:text-primary"
                onClick={handleGoBack}
              >
                <ChevronLeft size={16} className="mr-1" /> Go Back
              </Button>
            )}
            {currentDisplayQuestions.length === 0 && !canGoBack && (
                 <p className="text-sm text-muted-foreground text-center py-2">No more questions here. You can close the chat.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
