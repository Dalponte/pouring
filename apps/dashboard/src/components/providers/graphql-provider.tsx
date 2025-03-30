import { ApolloProvider } from "@apollo/client";
import { ReactNode } from "react";
import { apolloClient } from "@/lib/apolloClient";

interface ApolloProviderProps {
    children: ReactNode;
}

export function GraphQLProvider({ children }: ApolloProviderProps) {
    return (
        <ApolloProvider client={apolloClient}>
            {children}
        </ApolloProvider>
    );
}
