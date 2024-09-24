import { requestLogToServer } from "@pcd/passport-interface";
import { validateEmail } from "@pcd/util";
import { FormEvent, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { AppContainer } from "../../../components/shared/AppContainer";
import { appConfig } from "../../../src/appConfig";
import {
  useDispatch,
  useQuery,
  useSelf,
  useStateContext
} from "../../../src/appHooks";
import {
  pendingRequestKeys,
  setPendingAddRequest,
  setPendingAddSubscriptionRequest,
  setPendingGenericIssuanceCheckinRequest,
  setPendingGetWithoutProvingRequest,
  setPendingProofRequest,
  setPendingViewFrogCryptoRequest,
  setPendingViewSubscriptionsRequest
} from "../../../src/sessionStorage";
import { Button2 } from "../../shared/Button";
import { Input2 } from "../../shared/Input";
import { Typography } from "../../shared/Typography";

export const NewLoginScreen = (): JSX.Element => {
  const dispatch = useDispatch();
  const state = useStateContext().getState();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const query = useQuery();
  const redirectedFromAction = query?.get("redirectedFromAction") === "true";

  const pendingGetWithoutProvingRequest = query?.get(
    pendingRequestKeys.getWithoutProving
  );
  const pendingAddRequest = query?.get(pendingRequestKeys.add);
  const pendingProveRequest = query?.get(pendingRequestKeys.proof);
  const pendingViewSubscriptionsRequest = query?.get(
    pendingRequestKeys.viewSubscriptions
  );
  const pendingAddSubscriptionRequest = query?.get(
    pendingRequestKeys.addSubscription
  );
  const pendingViewFrogCryptoRequest = query?.get(
    pendingRequestKeys.viewFrogCrypto
  );
  const pendingGenericIssuanceCheckinRequest = query?.get(
    pendingRequestKeys.genericIssuanceCheckin
  );
  useEffect(() => {
    let pendingRequestForLogging: string | undefined = undefined;

    if (pendingGetWithoutProvingRequest) {
      setPendingGetWithoutProvingRequest(pendingGetWithoutProvingRequest);
      pendingRequestForLogging = pendingRequestKeys.getWithoutProving;
    } else if (pendingAddRequest) {
      setPendingAddRequest(pendingAddRequest);
      pendingRequestForLogging = pendingRequestKeys.add;
    } else if (pendingProveRequest) {
      setPendingProofRequest(pendingProveRequest);
      pendingRequestForLogging = pendingRequestKeys.proof;
    } else if (pendingViewSubscriptionsRequest) {
      setPendingViewSubscriptionsRequest(pendingViewSubscriptionsRequest);
      pendingRequestForLogging = pendingRequestKeys.viewSubscriptions;
    } else if (pendingAddSubscriptionRequest) {
      setPendingAddSubscriptionRequest(pendingAddSubscriptionRequest);
      pendingRequestForLogging = pendingRequestKeys.addSubscription;
    } else if (pendingViewFrogCryptoRequest) {
      setPendingViewFrogCryptoRequest(pendingViewFrogCryptoRequest);
      pendingRequestForLogging = pendingRequestKeys.viewFrogCrypto;
    } else if (pendingGenericIssuanceCheckinRequest) {
      setPendingGenericIssuanceCheckinRequest(
        pendingGenericIssuanceCheckinRequest
      );
      pendingRequestForLogging = pendingRequestKeys.genericIssuanceCheckin;
    }

    if (pendingRequestForLogging) {
      requestLogToServer(appConfig.zupassServer, "login-with-pending", {
        pending: pendingRequestForLogging
      });
    }
  }, [
    pendingGetWithoutProvingRequest,
    pendingAddRequest,
    pendingProveRequest,
    pendingViewSubscriptionsRequest,
    pendingAddSubscriptionRequest,
    pendingViewFrogCryptoRequest,
    pendingGenericIssuanceCheckinRequest
  ]);

  const suggestedEmail = query?.get("email");

  const self = useSelf();
  const [email, setEmail] = useState(suggestedEmail ?? "");

  const onGenPass = useCallback(
    function (e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const trimmedEmail = email.trim();

      if (trimmedEmail === "" || validateEmail(trimmedEmail) === false) {
        setError("Enter a valid email address");
      } else {
        setLoading(true);
        dispatch({
          type: "new-passport",
          email: trimmedEmail.toLocaleLowerCase("en-US"),
          newUi: true
        });
      }
    },
    [dispatch, email]
  );

  useEffect(() => {
    // Redirect to home if already logged in
    if (self) {
      window.location.hash = "#/";
    }
  }, [self]);

  return (
    <AppContainer bg="gray" fullscreen>
      <LoginContainer>
        <LoginTitleContainer>
          <Typography fontSize={24} fontWeight={800} color="#1E2C50">
            WELCOME TO ZUPASS
          </Typography>
          <Typography
            fontSize={16}
            fontWeight={400}
            color="#1E2C50"
            family="Neue Haas Unica"
          >
            Zupass is a zero knowledge application created by 0xPARC. It’s a
            stepping stone towards building the next internet.
          </Typography>
        </LoginTitleContainer>
        <LoginForm onSubmit={onGenPass}>
          <Input2
            autoCapitalize="off"
            autoCorrect="off"
            type="text"
            autoFocus
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(undefined);
            }}
            error={error}
            disabled={loading}
          />
          <Button2 type="submit" disabled={loading}>
            {loading ? "Verifying" : "Enter"}
          </Button2>
        </LoginForm>
      </LoginContainer>
    </AppContainer>
  );
};

export const LoginContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  gap: 12px;
  align-items: center;
`;
export const LoginTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  padding: 0px 12px;
  text-align: left;
`;
export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 8px;
  margin-bottom: 30px;
`;