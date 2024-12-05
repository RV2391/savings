import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AddressComponents, CalculatorData, Results } from "@/types";

interface ResultCardProps {
  results: Results;
  calculatorData: CalculatorData;
  addressComponents: AddressComponents;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  calculatorData,
  results,
  addressComponents,
}) => {
  const { toast } = useToast();
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);

  useEffect(() => {
    const loadForm = () => {
      if (window.hbspt && loadAttempts < 3) {
        const formContainer = document.getElementById('hubspotForm');
        if (!formContainer) return;

        // Clear previous form instances
        formContainer.innerHTML = '';

        window.hbspt.forms.create({
          region: "eu1",
          portalId: "139717164",
          formId: "13JR5IlFKTj-xcqP784kgoAeush9",
          target: "#hubspotForm",
          onFormReady: () => {
            console.log("HubSpot Form ready");
            setIsFormLoaded(true);
          },
          onFormSubmitted: () => {
            fetch('https://hook.eu2.make.com/14ebulh267s1rzskv00n7ho0q98sdxmj', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                team_size: Number(calculatorData.teamSize) || 0,
                dentists: Number(calculatorData.dentists) || 0,
                assistants: (Number(calculatorData.teamSize) || 0) - (Number(calculatorData.dentists) || 0),
                traditional_costs: Math.round(Number(results.totalTraditionalCosts)) || 0,
                crocodile_costs: Math.round(Number(results.crocodileCosts)) || 0,
                savings: Math.round(Number(results.savings)) || 0,
                street_address: addressComponents.street || '',
                city: addressComponents.city || '',
                postal_code: addressComponents.postalCode || '',
                timestamp: new Date().toISOString(),
                utm_medium: 'kalkulator',
                utm_campaign: 'cyberdeal',
                utm_term: 'november24'
              })
            }).catch(error => {
              console.error('Webhook error:', error);
            });

            toast({
              title: "Erfolg!",
              description: "Ihre Berechnung wurde gespeichert und wird an Ihre E-Mail-Adresse gesendet.",
            });
          }
        });
        
        setLoadAttempts(prev => prev + 1);
      }
    };

    loadForm();
  }, [calculatorData, results, addressComponents, toast, loadAttempts]);

  return (
    <Card className="w-full">
      <div className="p-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Erhalten Sie Ihre persönliche Berechnung per E-Mail
          </h3>
          <p className="text-muted-foreground">
            Wir senden Ihnen die detaillierte Auswertung kostenlos zu.
          </p>
        </div>
        
        <div 
          className="mt-6"
          style={{
            minHeight: '600px'
          }}
        >
          <div 
            id="hubspotForm"
            style={{ 
              position: 'relative',
              zIndex: 50
            }}
          />
          
          {!isFormLoaded && (
            <div className="text-center text-muted-foreground">
              Formular wird geladen...
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};